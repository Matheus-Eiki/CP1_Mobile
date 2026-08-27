import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tela Inicial</Text>

      <Text style={styles.texto}>
        Bem-vindo ao aplicativo!
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/Cadastro")}
      >
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  texto: {
    fontSize: 16,
    marginBottom: 30,
  },

  botao: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});