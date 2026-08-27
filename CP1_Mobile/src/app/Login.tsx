import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function fazerLogin() {
    // Limpa a mensagem de erro anterior
    setErro("");

    // Verifica campos vazios
    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      // Busca o usuário salvo
      const dados = await AsyncStorage.getItem("@usuario");

      // Verifica se existe usuário
      if (!dados) {
        setErro("Nenhum usuário cadastrado. Faça seu cadastro primeiro.");
        return;
      }

      // Converte o JSON para objeto
      const usuario = JSON.parse(dados);

      // Verifica e-mail e senha
      if (
        email.trim().toLowerCase() === usuario.email.toLowerCase() &&
        senha === usuario.senha
      ) {
        // Login correto
        router.replace("/");
      } else {
        // Login incorreto
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

      {/* Mensagem de erro */}
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
        onPress={() => router.push("/cadastro")}
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