import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tela Inicial</Text>

      <Text style={styles.texto}>
        Bem-vindo ao aplicativo!
      </Text>

      {/* Botão de Login */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/Login")}
      >
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      {/* Botão de Cadastro */}
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
    marginBottom: 15,
    width: 250,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});