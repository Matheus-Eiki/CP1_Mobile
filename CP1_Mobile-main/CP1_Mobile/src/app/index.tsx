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

const USER_STORAGE_KEY = "@myprofile:user";
const SESSION_STORAGE_KEY = "@myprofile:session";
const ALERT_LOGIN_KEY = "@mostrar_alerta_login";

type Usuario = {
  nome: string;
  username: string;
  email: string;
  senha: string;
  telefone: string;
  cidade: string;
  biografia: string;
};

export default function Index() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    carregarUsuario();
    verificarAlertaLogin();
  }, []);

  async function carregarUsuario() {
    try {
      // Verifica se existe uma sessão ativa
      const sessao = await AsyncStorage.getItem(
        SESSION_STORAGE_KEY
      );

      if (sessao !== "true") {
        setUsuario(null);
        return;
      }

      // Busca os dados do usuário
      const dados = await AsyncStorage.getItem(
        USER_STORAGE_KEY
      );

      if (dados) {
        setUsuario(JSON.parse(dados));
      } else {
        // Caso exista sessão, mas não exista usuário
        await AsyncStorage.removeItem(
          SESSION_STORAGE_KEY
        );

        setUsuario(null);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar usuário:",
        error
      );
    }
  }

  async function verificarAlertaLogin() {
    try {
      const mostrarAlerta =
        await AsyncStorage.getItem(
          ALERT_LOGIN_KEY
        );

      if (mostrarAlerta === "true") {
        // Remove a flag para não mostrar novamente
        await AsyncStorage.removeItem(
          ALERT_LOGIN_KEY
        );

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
      console.error(
        "Erro ao mostrar alerta:",
        error
      );
    }
  }

  async function fazerLogout() {
    try {
      // Remove somente a sessão
      await AsyncStorage.removeItem(
        SESSION_STORAGE_KEY
      );

      setUsuario(null);

      Alert.alert(
        "Logout",
        "Você saiu da sua conta."
      );
    } catch (error) {
      console.error(
        "Erro ao fazer logout:",
        error
      );
    }
  }

  function abrirPerfil() {
    router.push("/Perfil");
  }

  return (
    <View style={styles.container}>

      {/* USUÁRIO NO CANTO SUPERIOR DIREITO */}
      {usuario && (
        <View style={styles.usuarioContainer}>

          <TouchableOpacity
            onPress={abrirPerfil}
          >
            <Text style={styles.usuario}>
              {usuario.nome}
            </Text>

            <Text style={styles.username}>
              @{usuario.username}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={fazerLogout}
          >
            <Text style={styles.logout}>
              Logout
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* CONTEÚDO PRINCIPAL */}

      <Text style={styles.titulo}>
        Tela Inicial
      </Text>

      <Text style={styles.texto}>
        Bem-vindo ao aplicativo!
      </Text>

      {/* USUÁRIO NÃO LOGADO */}

      {!usuario && (
        <>
          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              router.push("/Login")
            }
          >
            <Text style={styles.textoBotao}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              router.push("/Cadastro")
            }
          >
            <Text style={styles.textoBotao}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* USUÁRIO LOGADO */}

      {usuario && (
        <>
          <TouchableOpacity
            style={styles.botao}
            onPress={abrirPerfil}
          >
            <Text style={styles.textoBotao}>
              Meu Perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoLogout}
            onPress={fazerLogout}
          >
            <Text style={styles.textoBotao}>
              Logout
            </Text>
          </TouchableOpacity>
        </>
      )}

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

  /* USUÁRIO */

  usuarioContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    alignItems: "flex-end",
  },

  usuario: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },

  username: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  logout: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 6,
  },

  /* TELA */

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  texto: {
    fontSize: 16,
    marginBottom: 30,
  },

  /* BOTÃO */

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

  /* LOGOUT */

  botaoLogout: {
    backgroundColor: "#777",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: 250,
    alignItems: "center",
  },
});