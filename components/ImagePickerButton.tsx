import { Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Image, View } from "react-native";

type Props = {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  image: string | null;
  title: string;
  aspect?: [number, number];
};

const ImagePickerButton = (props: Props) => {
  const { setImage, image, title } = props;
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: props.aspect,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View>
      <Button title={title} onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

export default ImagePickerButton;
