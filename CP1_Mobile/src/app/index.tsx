import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    carregarUsuario();
    verificarAlertaLogin();
  }, []);

  async function carregarUsuario() {
    try {
      const dados = await AsyncStorage.getItem("@usuario_logado");

      if (dados) {
        setUsuario(JSON.parse(dados));
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  }

  async function verificarAlertaLogin() {
    try {
      const mostrarAlerta = await AsyncStorage.getItem(
        "@mostrar_alerta_login"
      );

      if (mostrarAlerta === "true") {
        // Remove a flag para o alerta não aparecer novamente
        await AsyncStorage.removeItem("@mostrar_alerta_login");

        Alert.alert(
          "Atenção",
          "Você já está logado!",
          [
            {
              text: "OK",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Erro ao mostrar alerta:", error);
    }
  }

  async function fazerLogout() {
    await AsyncStorage.removeItem("@usuario_logado");

    setUsuario(null);
  }

  return (
    <View style={styles.container}>

      {/* Usuário no canto superior direito */}
      {usuario && (
        <View style={styles.usuarioContainer}>
          <Text style={styles.usuario}>
            {usuario.nome}
          </Text>

          <TouchableOpacity onPress={fazerLogout}>
            <Text style={styles.logout}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.titulo}>
        Tela Inicial
      </Text>

      <Text style={styles.texto}>
        Bem-vindo ao aplicativo!
      </Text>

      {/* Login só aparece se NÃO estiver logado */}
      {!usuario && (
        <TouchableOpacity
          style={styles.botao}
          onPress={() => router.push("/Login")}
        >
          <Text style={styles.textoBotao}>
            Login
          </Text>
        </TouchableOpacity>
      )}

      {/* Cadastro */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/Cadastro")}
      >
        <Text style={styles.textoBotao}>
          Cadastrar
        </Text>
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

  usuarioContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    alignItems: "flex-end",
  },

  usuario: {
    fontSize: 16,
    fontWeight: "bold",
  },

  logout: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
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