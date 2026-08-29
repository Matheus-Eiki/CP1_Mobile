import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const USER_STORAGE_KEY = "@myprofile:user";
const SESSION_STORAGE_KEY = "@myprofile:session";

export default function Login() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  // Verifica se já existe uma sessão
  useEffect(() => {
    verificarSessao();
  }, []);

  async function verificarSessao() {
    try {
      const sessao = await AsyncStorage.getItem(
        SESSION_STORAGE_KEY
      );

      if (sessao === "true") {
        // Já está logado
        router.replace("/");
        return;
      }
    } catch (error) {
      console.error(
        "Erro ao verificar sessão:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function fazerLogin() {
    setErro("");

    // Username obrigatório
    if (!username.trim()) {
      setErro(
        "Informe seu nome de usuário."
      );
      return;
    }

    // Senha obrigatória
    if (!senha) {
      setErro(
        "Informe sua senha."
      );
      return;
    }

    setLoading(true);

    try {
      // Busca usuário cadastrado
      const dados =
        await AsyncStorage.getItem(
          USER_STORAGE_KEY
        );

      if (!dados) {
        setErro(
          "Nenhum usuário cadastrado. Faça seu cadastro primeiro."
        );
        return;
      }

      const usuario = JSON.parse(dados);

      // Verifica username e senha
      if (
        username.trim().toLowerCase() ===
          usuario.username.toLowerCase() &&
        senha === usuario.senha
      ) {
        // Salva a sessão
        await AsyncStorage.setItem(
          SESSION_STORAGE_KEY,
          "true"
        );

        // Vai para o perfil
        router.replace("/");
      } else {
        setErro(
          "Nome de usuário ou senha incorretos."
        );
      }

    } catch (error) {
      console.error(
        "Erro no login:",
        error
      );

      setErro(
        "Não foi possível realizar o login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  // Enquanto verifica a sessão
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingTexto}>
          Verificando sessão...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Login
      </Text>

      {/* Erro */}
      {erro !== "" && (
        <View style={styles.notificacao}>
          <Text style={styles.textoErro}>
            {erro}
          </Text>

          <TouchableOpacity
            onPress={() => setErro("")}
          >
            <Text style={styles.fechar}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {/* Entrar */}
      <TouchableOpacity
        style={styles.botao}
        onPress={fazerLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>
            Entrar
          </Text>
        )}
      </TouchableOpacity>

      {/* Cadastro */}
      <View style={styles.cadastroContainer}>
        <Text style={styles.textoCadastro}>
          Ainda não tem cadastro?
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/Cadastro")}
        >
          <Text style={styles.linkCadastro}>
            Cadastrar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Voltar */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => router.back()}
      >
        <Text style={styles.textoVoltar}>
          Voltar
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingTexto: {
    marginTop: 15,
    fontSize: 16,
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

  botao: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  notificacao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8d7da",
    borderWidth: 1,
    borderColor: "#dc3545",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },

  textoErro: {
    flex: 1,
    color: "#721c24",
    fontSize: 15,
    fontWeight: "bold",
  },

  fechar: {
    fontSize: 18,
    marginLeft: 10,
  },

  cadastroContainer: {
    alignItems: "center",
    marginTop: 25,
  },

  textoCadastro: {
    fontSize: 15,
    marginBottom: 5,
  },

  linkCadastro: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  botaoVoltar: {
    backgroundColor: "#777",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  textoVoltar: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});