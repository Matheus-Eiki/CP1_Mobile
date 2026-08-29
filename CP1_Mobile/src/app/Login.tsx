import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {
    try {
      const usuarioLogado = await AsyncStorage.getItem("@usuario_logado");

      if (usuarioLogado) {
        // Salva uma informação para a tela inicial mostrar o alerta
        await AsyncStorage.setItem("@mostrar_alerta_login", "true");

        // Volta imediatamente para a tela inicial
        router.replace("/");
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error);
    }
  }

  async function fazerLogin() {
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      const dados = await AsyncStorage.getItem("@usuario");

      if (!dados) {
        setErro("Nenhum usuário cadastrado. Faça seu cadastro primeiro.");
        return;
      }

      const usuario = JSON.parse(dados);

      if (
        email.trim().toLowerCase() === usuario.email.toLowerCase() &&
        senha === usuario.senha
      ) {
        // Salva o usuário como logado
        await AsyncStorage.setItem(
          "@usuario_logado",
          JSON.stringify(usuario)
        );

        // Volta para a tela inicial
        router.replace("/");
      } else {
        setErro("E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Ocorreu um erro ao tentar realizar o login.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {erro !== "" && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={fazerLogin}
      >
        <Text style={styles.textoBotao}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/Cadastro")}
      >
        <Text style={styles.cadastro}>
          Não possui uma conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  erro: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 16,
  },

  botao: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  cadastro: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 15,
  },
});