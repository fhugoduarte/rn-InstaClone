import React, { Component } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import ImagePicker from "react-native-image-picker";
import api from "../../services/api";

import styles from "./styles";

export default class New extends Component {
  static navigationOptions = {
    headerTitle: "Nova publicação"
  };

  state = {
    preview: null,
    image: null,
    author: "",
    place: "",
    description: "",
    hashtags: ""
  };

  handleSelectImage = () => {
    ImagePicker.showImagePicker(
      {
        title: "Selecionar imagem"
      },
      upload => {
        if (upload.error) {
          console.log("Error");
        } else if (upload.didCancel) {
          console.log("Used canceled");
        } else {
          const preview = {
            uri: `data:image/jpeg;base64,${upload.data}`
          };

          let prefix;
          let ext;

          if (upload.fileName) {
            [prefix, ext] = upload.fileName.split(".");
            ext = ext.toLowerCase() === "heic" ? "jpg" : ext;
          } else {
            prefix = new Date().getTime();
            ext = "jpg";
          }

          const image = {
            uri: upload.uri,
            type: upload.type,
            name: `${prefix}.${ext}`
          };

          this.setState({ preview, image });
        }
      }
    );
  };

  handleSubmit = async () => {
    const { image, author, place, description, hashtags } = this.state;

    const data = new FormData();
    data.append("image", image);
    data.append("author", author);
    data.append("place", place);
    data.append("description", description);
    data.append("hashtags", hashtags);

    await api.post("posts", data);
    this.props.navigation.navigate("Feed");
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => this.handleSelectImage()}
        >
          <Text style={styles.selectButtonText}>Selecionar imagem</Text>
        </TouchableOpacity>
        {this.state.preview && (
          <Image style={styles.preview} source={this.state.preview} />
        )}
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nome do autor"
          placeholderTextColor="#999"
          value={this.state.author}
          onChangeText={author => this.setState({ author })}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Local da foto"
          placeholderTextColor="#999"
          value={this.state.place}
          onChangeText={place => this.setState({ place })}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Descrição"
          placeholderTextColor="#999"
          value={this.state.description}
          onChangeText={description => this.setState({ description })}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Hashtags"
          placeholderTextColor="#999"
          value={this.state.hashtags}
          onChangeText={hashtags => this.setState({ hashtags })}
        />
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => this.handleSubmit()}
        >
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
