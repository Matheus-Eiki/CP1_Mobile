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

const USER_STORAGE_KEY = "@myprofile:user";
const SESSION_STORAGE_KEY = "@myprofile:session";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | ""
  >("");

  const [confirmandoExclusao, setConfirmandoExclusao] =
    useState(false);

  function mostrarMensagem(
    texto: string,
    tipo: "sucesso" | "erro"
  ) {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  async function cadastrar() {
    setMensagem("");

    // Nome obrigatório
    if (!nome.trim()) {
      mostrarMensagem(
        "Informe seu nome.",
        "erro"
      );
      return;
    }

    // Nome de usuário obrigatório
    if (!username.trim()) {
      mostrarMensagem(
        "Informe seu nome de usuário.",
        "erro"
      );
      return;
    }

    // E-mail obrigatório
    if (!email.trim()) {
      mostrarMensagem(
        "Informe seu e-mail.",
        "erro"
      );
      return;
    }

    // Validação básica do e-mail
    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email.trim())) {
      mostrarMensagem(
        "Informe um e-mail válido.",
        "erro"
      );
      return;
    }

    // Senha obrigatória
    if (!senha) {
      mostrarMensagem(
        "Informe sua senha.",
        "erro"
      );
      return;
    }

    // Confirmação obrigatória
    if (!confirmarSenha) {
      mostrarMensagem(
        "Confirme sua senha.",
        "erro"
      );
      return;
    }

    // Senhas iguais
    if (senha !== confirmarSenha) {
      mostrarMensagem(
        "As senhas não são iguais.",
        "erro"
      );
      return;
    }

    try {
      // Verifica se já existe cadastro
      const usuarioExistente =
        await AsyncStorage.getItem(
          USER_STORAGE_KEY
        );

      if (usuarioExistente) {
        mostrarMensagem(
          "Já existe um usuário cadastrado.",
          "erro"
        );
        return;
      }

      // Cria o usuário
      const usuario = {
        nome: nome.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,

        // Campos que serão utilizados
        // na tela de perfil
        telefone: "",
        cidade: "",
        biografia: "",
      };

      // Salva o usuário
      await AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(usuario)
      );

      mostrarMensagem(
        "Cadastro realizado com sucesso!",
        "sucesso"
      );

      // Limpa os campos
      setNome("");
      setUsername("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

    } catch (error) {
      console.error(
        "Erro ao cadastrar:",
        error
      );

      mostrarMensagem(
        "Não foi possível realizar o cadastro. Tente novamente.",
        "erro"
      );
    }
  }

  async function excluirCadastro() {
    try {
      const usuario =
        await AsyncStorage.getItem(
          USER_STORAGE_KEY
        );

      if (!usuario) {
        mostrarMensagem(
          "Não existe nenhum cadastro para excluir.",
          "erro"
        );

        setConfirmandoExclusao(false);
        return;
      }

      // Remove o cadastro
      await AsyncStorage.removeItem(
        USER_STORAGE_KEY
      );

      // Remove também a sessão
      await AsyncStorage.removeItem(
        SESSION_STORAGE_KEY
      );

      // Limpa os campos
      setNome("");
      setUsername("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      setConfirmandoExclusao(false);

      mostrarMensagem(
        "Cadastro excluído com sucesso!",
        "sucesso"
      );

    } catch (error) {
      console.error(
        "Erro ao excluir cadastro:",
        error
      );

      setConfirmandoExclusao(false);

      mostrarMensagem(
        "Não foi possível excluir o cadastro. Tente novamente.",
        "erro"
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Criar conta
      </Text>

      {/* NOTIFICAÇÃO */}
      {mensagem !== "" && (
        <View
          style={[
            styles.notificacao,
            tipoMensagem === "sucesso"
              ? styles.notificacaoSucesso
              : styles.notificacaoErro,
          ]}
        >
          <Text
            style={
              tipoMensagem === "sucesso"
                ? styles.textoSucesso
                : styles.textoErro
            }
          >
            {mensagem}
          </Text>

          <TouchableOpacity
            onPress={() => setMensagem("")}
          >
            <Text style={styles.fechar}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* NOME */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      {/* USERNAME */}
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* E-MAIL */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* SENHA */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {/* CONFIRMAR SENHA */}
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      {/* CADASTRAR */}
      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
      >
        <Text style={styles.textoBotao}>
          Cadastrar
        </Text>
      </TouchableOpacity>

      {/* EXCLUIR CADASTRO */}
      {!confirmandoExclusao ? (
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() =>
            setConfirmandoExclusao(true)
          }
        >
          <Text style={styles.textoExcluir}>
            Excluir cadastro
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.confirmacao}>

          <Text style={styles.textoConfirmacao}>
            Tem certeza que deseja excluir o cadastro?
          </Text>

          <Text style={styles.subtextoConfirmacao}>
            Essa ação não pode ser desfeita.
          </Text>

          <View style={styles.botoesConfirmacao}>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() =>
                setConfirmandoExclusao(false)
              }
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoConfirmarExclusao}
              onPress={excluirCadastro}
            >
              <Text style={styles.textoExcluir}>
                Excluir
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

      {/* VOLTAR */}
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

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  /* CADASTRAR */

  botao: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  /* EXCLUIR */

  botaoExcluir: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  textoExcluir: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  /* CONFIRMAÇÃO */

  confirmacao: {
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    backgroundColor: "#fff5f5",
  },

  textoConfirmacao: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtextoConfirmacao: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
    color: "#666",
  },

  botoesConfirmacao: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  botaoCancelar: {
    flex: 1,
    backgroundColor: "#777",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  textoCancelar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  botaoConfirmarExclusao: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  /* VOLTAR */

  botaoVoltar: {
    backgroundColor: "#777",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  textoVoltar: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  /* NOTIFICAÇÃO */

  notificacao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
  },

  notificacaoSucesso: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
  },

  notificacaoErro: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
  },

  textoSucesso: {
    flex: 1,
    color: "#155724",
    fontSize: 15,
    fontWeight: "bold",
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
});