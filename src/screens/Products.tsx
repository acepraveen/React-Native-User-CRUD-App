import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TextInput,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Pencil from '../assets/images/pencil.svg';
import Cross from '../assets/images/cross.svg';
import Camera from '../assets/images/camera.svg';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function Products() {
  const [productList, setProductList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();
  const [updatedProduct, setUpdatedProduct] = useState({
    title: '',
    desc: '',
    imagePath: '',
  });
  const [imgData, setImgData] = useState('');
  const [borderChange, setBorderChange] = useState({
    titleBorder: '#ccc',
    descBorder: '#ccc',
  });
  const [addNew, setAddNew] = useState(false);

  const navigation = useNavigation();

  const showErrorToast = message => {
    Toast.show({
      type: 'error',
      text1: 'Card',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const showSuccessToast = message => {
    Toast.show({
      type: 'success',
      text1: 'Card',
      text2: message,
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const logoutAction = async () => {
    await AsyncStorage.getAllKeys().then(key => {
      AsyncStorage.multiRemove(key);
    });
    navigation.replace('Login');
  };

  const getProduct = async () => {
    let token = await AsyncStorage.getItem('token');
    console.log('to3', `Bearer ${token}`);

    await fetch('GET USERLIST API', {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token?.replace(/"+/g, '')}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(async res => {
        console.log('res', res);
        if (res.userlist) {
          setProductList(res.userlist);
        } else {
          logoutAction();
          console.log('err', res.error);
        }
      });
  };

  const addNewProduct = async () => {
    let token = await AsyncStorage.getItem('token');

    if (!updatedProduct.title) {
      showErrorToast('Please enter title');
      setBorderChange({...borderChange, titleBorder: 'red'});
      return;
    } else if (!updatedProduct.desc) {
      showErrorToast('Please enter Description');
      setBorderChange({...borderChange, descBorder: 'red'});
      return;
    } else if (!imgData) {
      showErrorToast('Please upload image');
      return;
    }

    let formdata = new FormData();

    formdata.append('title', updatedProduct.title);
    formdata.append('desc', updatedProduct.desc);
    formdata.append('imagePath', imgData);

    await fetch(`ADD TO USERLIST API`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token?.replace(/"+/g, '')}`,
        'Content-type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(res => {
        return res.json();
      })
      .then(async res => {
        console.log('ADD', res);
        if (res.newUserlist) {
          getProduct();
          setEditModal(false);
        } else {
          console.log('err', res.error);
        }
      });
  };

  const editProduct = async () => {
    let token = await AsyncStorage.getItem('token');

    if (!updatedProduct.title) {
      showErrorToast('Please enter title');
      setBorderChange({...borderChange, titleBorder: 'red'});
      return;
    } else if (!updatedProduct.desc) {
      showErrorToast('Please enter Description');
      setBorderChange({...borderChange, descBorder: 'red'});
      return;
    }

    if (
      currentProduct.title === updatedProduct.title &&
      currentProduct.desc === updatedProduct.desc
    ) {
      showSuccessToast('Card updated successfully');
      setEditModal(false);
    } else {
      let data = JSON.stringify({
        title: updatedProduct.title,
        desc: updatedProduct.desc,
      });

      await fetch(
        `UPDATE USER DATA/${updatedProduct?.id}`,
        {
          method: 'put',
          headers: {
            Authorization: `Bearer ${token?.replace(/"+/g, '')}`,
            'Content-type': 'application/json',
          },
          body: data,
        },
      )
        .then(res => {
          return res.json();
        })
        .then(async res => {
          console.log('res', res);
          if (res.updatedData) {
            getProduct();
            setEditModal(false);
          } else {
            console.log('err', res.error);
          }
        });
    }
  };

  const imagePickerData = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const fileName = image.path.split('/').pop();

      console.log(image);
      setImgData({
        name: fileName,
        uri: image.path,
        type: image.mime,
      });
      setUpdatedProduct({...updatedProduct, imagePath: image.path});
    });
  };

  useEffect(() => {
    getProduct();
  }, []);

  return productList.length > 1 ? (
    <View style={styles.container}>
      <Modal transparent visible={editModal}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: responsiveHeight(3),
              height: responsiveHeight(65),
              width: responsiveWidth(90),
              overflow: 'hidden',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.userTxt,
                  {
                    width: responsiveWidth(60),
                    textAlign: 'right',
                    fontWeight: 'bold',
                  },
                ]}>
                {addNew ? 'Add Card' : 'Edit Card'}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  padding: responsiveHeight(1),
                  alignSelf: 'flex-end',
                }}
                onPress={() => {
                  setEditModal(false);
                }}>
                <Cross width={25} height={25} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.inputContainer}>
                <ImageBackground
                  source={{
                    uri: updatedProduct.imagePath
                      ? updatedProduct.imagePath
                      : currentProduct?.imagePath,
                  }}
                  style={{
                    height: responsiveHeight(10),
                    width: responsiveWidth(20),
                    borderRadius: responsiveWidth(10),
                    overflow: 'hidden',
                    alignItem: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fab74e',
                  }}
                  resizeMode={'cover'}>
                  {addNew ? (
                    <TouchableOpacity
                      onPress={() => {
                        imagePickerData();
                      }}
                      style={{alignSelf: 'center'}}>
                      <Camera width={30} height={30} />
                    </TouchableOpacity>
                  ) : null}
                </ImageBackground>
                <TextInput
                  style={[
                    styles.input,
                    {borderWidth: 2, borderColor: borderChange.titleBorder},
                  ]}
                  placeholder="Title"
                  placeholderTextColor="gray"
                  onChangeText={text => {
                    setUpdatedProduct({...updatedProduct, title: text});
                    setBorderChange({...borderChange, titleBorder: '#ccc'});
                  }}
                  value={updatedProduct.title}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderWidth: 2,
                      borderColor: borderChange.descBorder,
                      textAlignVertical: 'top',
                      height: responsiveHeight(15),
                    },
                  ]}
                  placeholder="Description"
                  placeholderTextColor="gray"
                  onChangeText={text => {
                    setUpdatedProduct({...updatedProduct, desc: text});
                    setBorderChange({...borderChange, descBorder: '#ccc'});
                  }}
                  value={updatedProduct.desc}
                  defaultValue={currentProduct?.desc}
                  multiline={true}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (addNew) {
                    addNewProduct();
                  } else {
                    editProduct();
                  }
                }}
                style={styles.btn}>
                <Text style={styles.btnTxt}>{addNew ? 'Add' : 'Update'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.row}>
        <Text style={styles.userTxt}>Hello User </Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await logoutAction();
          }}>
          <Text style={styles.logoutBtnTxt}>Logout </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => {
          setEditModal(true);
          setAddNew(true);
          setImgData('');
          setUpdatedProduct({
            ...updatedProduct,
            title: '',
            desc: '',
            imagePath: 'new',
          });
        }}>
        <Text style={styles.logoutBtnTxt}>Add New Card </Text>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: responsiveHeight(3)}}
        data={productList}
        renderItem={({item}) => {
          return (
            <View
              style={{
                marginTop: responsiveHeight(3),
                backgroundColor: 'white',
                elevation: 5,
                borderRadius: responsiveWidth(5),
                paddingHorizontal: responsiveWidth(3),
                flexDirection: 'row',
                alignItems: 'center',
                height: responsiveHeight(20),
              }}>
              <Image
                source={{uri: item.imagePath}}
                style={{
                  height: responsiveHeight(10),
                  width: responsiveWidth(20),
                  borderRadius: responsiveWidth(10),
                  overflow: 'hidden',
                }}
                resizeMode={'cover'}
              />
              <View
                style={{
                  marginLeft: responsiveWidth(5),
                  marginVertical: responsiveWidth(5),
                }}>
                <Text
                  style={{
                    fontWeight: 'blod',
                    color: 'black',
                    fontSize: responsiveFontSize(3),
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: responsiveFontSize(2),
                    width: responsiveWidth(50),
                  }}
                  numberOfLines={5}>
                  {item.desc}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setEditModal(true);
                    setAddNew(false);
                    setCurrentProduct(item);
                    setUpdatedProduct({
                      ...updatedProduct,
                      title: item.title,
                      desc: item.desc,
                      id: item._id,
                      imagePath: item.imagePath,
                    });
                    setBorderChange({
                      ...borderChange,
                      titleBorder: '#ccc',
                      descBorder: '#ccc',
                    });
                  }}>
                  <Pencil width={35} height={35} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.row}>
        <ShimmerPlaceholder
          style={{height: responsiveHeight(5), width: responsiveWidth(35)}}
          shimmerColors={['white', 'gray', '#ccc']}
        />
        <ShimmerPlaceholder
          style={{
            height: responsiveHeight(5),
            width: responsiveWidth(25),
            borderRadius: responsiveHeight(10),
          }}
          shimmerColors={['white', 'red', '#ccc']}
        />
      </View>

      <ShimmerPlaceholder
        style={{
          height: responsiveHeight(5),
          width: responsiveWidth(35),
          borderRadius: responsiveHeight(10),
          marginTop: responsiveHeight(3),
          marginLeft: responsiveHeight(2),
        }}
        shimmerColors={['white', '#fab74e', '#ccc']}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={[1, 1, 1, 1]}
        renderItem={() => (
          <View style={[styles.row, {marginTop: responsiveHeight(10)}]}>
            <ShimmerPlaceholder
              style={{
                height: responsiveHeight(10),
                width: responsiveWidth(20),
                borderRadius: responsiveHeight(15 / 2),
                marginTop: responsiveHeight(3),
                marginLeft: responsiveHeight(2),
              }}
              shimmerColors={['white', 'white', '#ccc']}
            />
            <View>
              <ShimmerPlaceholder
                style={{
                  height: responsiveHeight(3),
                  width: responsiveWidth(30),
                  borderRadius: responsiveHeight(1),
                  marginTop: responsiveHeight(3),
                }}
                shimmerColors={['white', 'white', '#ccc']}
              />
              <ShimmerPlaceholder
                style={{
                  height: responsiveHeight(3),
                  width: responsiveWidth(35),
                  borderRadius: responsiveHeight(1),
                  marginTop: responsiveHeight(3),
                }}
                shimmerColors={['white', 'white', '#ccc']}
              />
            </View>
            <ShimmerPlaceholder
              style={{
                height: responsiveHeight(4),
                width: responsiveWidth(5),
                borderRadius: responsiveHeight(1),
                marginTop: responsiveHeight(3),
              }}
              shimmerColors={['white', 'white', '#ccc']}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveHeight(2),
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(4),
  },
  logoutBtn: {
    backgroundColor: 'red',
    padding: 10,
    // alignSelf: 'center',
    borderRadius: responsiveHeight(10),
  },
  newBtn: {
    backgroundColor: '#fab74e',
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: responsiveHeight(10),
    marginVertical: responsiveHeight(2),
  },
  logoutBtnTxt: {
    color: 'white',
  },
  userTxt: {
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
  input: {
    height: 60,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    width: responsiveWidth(80),
    marginTop: responsiveHeight(4),
    color: 'black',
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  btn: {
    backgroundColor: '#fab74e',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(1),
    borderRadius: 50,
    elevation: 10,
    alignSelf: 'center',
    marginTop: responsiveHeight(5),
    marginBottom: responsiveHeight(3),
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: '#fff',
    fontWeight: 'bold',
  },
});
