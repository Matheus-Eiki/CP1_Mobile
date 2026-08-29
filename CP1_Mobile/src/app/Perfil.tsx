import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const USER_STORAGE_KEY = "@myprofile:user";
const SESSION_STORAGE_KEY = "@myprofile:session";

type Usuario = {
  nome: string;
  username: string;
  email: string;
  senha: string;
  telefone: string;
  cidade: string;
  biografia: string;
};

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      // Verifica se existe uma sessão ativa
      const sessao = await AsyncStorage.getItem(
        SESSION_STORAGE_KEY
      );

      if (sessao !== "true") {
        router.replace("/Login");
        return;
      }

      // Busca os dados do usuário
      const dados = await AsyncStorage.getItem(
        USER_STORAGE_KEY
      );

      if (!dados) {
        await AsyncStorage.removeItem(
          SESSION_STORAGE_KEY
        );

        router.replace("/Login");
        return;
      }

      const usuarioSalvo: Usuario = JSON.parse(dados);

      setUsuario(usuarioSalvo);
    } catch (error) {
      console.error(
        "Erro ao carregar perfil:",
        error
      );

      router.replace("/Login");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOGOUT
  // =========================

  async function logout() {
    try {
      // Remove somente a sessão
      // O cadastro continua salvo
      await AsyncStorage.removeItem(
        SESSION_STORAGE_KEY
      );

      setUsuario(null);

      router.replace("/");
    } catch (error) {
      console.error(
        "Erro ao sair:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível sair da conta."
      );
    }
  }

  function confirmarLogout() {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  }

  // =========================
  // EXCLUIR CONTA
  // =========================

  async function excluirConta() {
    try {
      // Remove o cadastro
      await AsyncStorage.removeItem(
        USER_STORAGE_KEY
      );

      // Remove a sessão
      await AsyncStorage.removeItem(
        SESSION_STORAGE_KEY
      );

      setUsuario(null);

      router.replace("/");
    } catch (error) {
      console.error(
        "Erro ao excluir conta:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível excluir sua conta."
      );
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: excluirConta,
        },
      ]
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
        />

        <Text style={styles.loadingTexto}>
          Carregando perfil...
        </Text>
      </View>
    );
  }

  if (!usuario) {
    return null;
  }

  // =========================
  // PERFIL
  // =========================

  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}

      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.ola}>
            Olá,
          </Text>

          <Text style={styles.nomeCabecalho}>
            {usuario.nome}
          </Text>
        </View>

        {/* Avatar */}

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {usuario.nome
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>
      </View>

      {/* TÍTULO */}

      <Text style={styles.titulo}>
        Meu Perfil
      </Text>

      {/* INFORMAÇÕES */}

      <View style={styles.card}>

        {/* Nome */}

        <View style={styles.informacao}>
          <Text style={styles.label}>
            Nome
          </Text>

          <Text style={styles.valor}>
            {usuario.nome}
          </Text>
        </View>

        {/* Username */}

        <View style={styles.informacao}>
          <Text style={styles.label}>
            Nome de usuário
          </Text>

          <Text style={styles.valor}>
            @{usuario.username}
          </Text>
        </View>

        {/* E-mail */}

        <View style={styles.informacao}>
          <Text style={styles.label}>
            E-mail
          </Text>

          <Text style={styles.valor}>
            {usuario.email}
          </Text>
        </View>

        {/* Telefone */}

        <View style={styles.informacao}>
          <Text style={styles.label}>
            Telefone
          </Text>

          <Text style={styles.valor}>
            {usuario.telefone || "Não informado"}
          </Text>
        </View>

        {/* Cidade */}

        <View style={styles.informacao}>
          <Text style={styles.label}>
            Cidade
          </Text>

          <Text style={styles.valor}>
            {usuario.cidade || "Não informado"}
          </Text>
        </View>

        {/* Biografia */}

        <View style={styles.informacao}>
          <Text style={styles.label}>
            Biografia
          </Text>

          <Text style={styles.valor}>
            {usuario.biografia || "Não informado"}
          </Text>
        </View>

      </View>

      {/* EDITAR PERFIL */}

      <TouchableOpacity
        style={styles.botao}
        onPress={() =>
          router.push("/EditarPerfil")
        }
      >
        <Text style={styles.textoBotao}>
          ✏️ Editar Perfil
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.botaoSair}
        onPress={confirmarLogout}
      >
        <Text style={styles.textoBotao}>
          🚪 Sair
        </Text>
      </TouchableOpacity>

      {/* EXCLUIR CONTA */}

      <TouchableOpacity
        style={styles.botaoExcluir}
        onPress={confirmarExclusao}
      >
        <Text style={styles.textoExcluir}>
          🗑️ Excluir minha conta
        </Text>
      </TouchableOpacity>

      {/* VOLTAR */}

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.textoVoltar}>
          ← Voltar para o início
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  // CONTAINER

  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },

  // LOADING

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

  // CABEÇALHO

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  ola: {
    fontSize: 18,
    color: "#666",
  },

  nomeCabecalho: {
    fontSize: 28,
    fontWeight: "bold",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarTexto: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  // TÍTULO

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  // CARD

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  informacao: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 3,
  },

  valor: {
    fontSize: 16,
    fontWeight: "500",
  },

  // BOTÃO EDITAR

  botao: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  // SAIR

  botaoSair: {
    backgroundColor: "#777",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  // EXCLUIR

  botaoExcluir: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  textoExcluir: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  // VOLTAR

  botaoVoltar: {
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  textoVoltar: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});