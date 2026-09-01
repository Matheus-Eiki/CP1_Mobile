import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ThemeContext } from "../contexts/ThemeContext";

const USER_STORAGE_KEY = "@myprofile:user";
const SESSION_STORAGE_KEY = "@myprofile:session";

type Usuario = {
  nome: string;
  username: string;
  email: string;
  senha?: string;
  telefone: string;
  cidade: string;
  biografia: string;
};

export default function Perfil() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const colors = {
    background: isDark ? "#121212" : "#fff",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#aaa" : "#666",
    cardBg: isDark ? "#1E1E1E" : "#fff",
    borderColor: isDark ? "#333" : "#ddd",
    inputBg: isDark ? "#2A2A2A" : "#f9f9f9"
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      const sessao = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      
      if (sessao !== "true") {
        router.replace("/Login");
        return;
      }

      const dados = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (!dados) {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
        router.replace("/Login");
        return;
      }

      const usuarioSalvo: Usuario = JSON.parse(dados);
      setUsuario(usuarioSalvo);
    } catch (error) {
      router.replace("/Login");
    } finally {
      setLoading(false);
    }
  }

  async function salvarPerfil() {
    if (!usuario?.nome.trim() || !usuario?.email.trim()) {
      Alert.alert("Erro", "Nome e e-mail são obrigatórios.");
      return;
    }
    
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuario));
      setIsEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  }

  function handleInputChange(field: keyof Usuario, value: string) {
    if (usuario) {
      setUsuario({ ...usuario, [field]: value });
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      setUsuario(null);
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  function confirmarLogout() {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  }

  async function excluirConta() {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      setUsuario(null);
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir sua conta.");
    }
  }

  function confirmarExclusao() {
    Alert.alert("Excluir conta", "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: excluirConta },
    ]);
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingTexto, { color: colors.textPrimary }]}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.cabecalho}>
        <View>
          <Text style={[styles.ola, { color: colors.textSecondary }]}>Olá,</Text>
          <Text style={[styles.nomeCabecalho, { color: colors.textPrimary }]}>{usuario.nome}</Text>
        </View>
        <View style={styles.acoesCabecalho}>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
            thumbColor={'#fff'}
          />
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{usuario.nome.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.titulo, { color: colors.textPrimary }]}>Meu Perfil</Text>

      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        {[
          { key: 'nome', label: 'Nome' },
          { key: 'username', label: 'Nome de usuário' },
          { key: 'email', label: 'E-mail' },
          { key: 'telefone', label: 'Telefone' },
          { key: 'cidade', label: 'Cidade' },
          { key: 'biografia', label: 'Biografia', multiline: true }
        ].map((campo) => (
          <View key={campo.key} style={styles.informacao}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{campo.label}</Text>
            {isEditing ? (
              <TextInput
                style={[
                  styles.input, 
                  { color: colors.textPrimary, borderColor: colors.borderColor, backgroundColor: colors.inputBg },
                  campo.multiline && styles.textArea
                ]}
                value={usuario[campo.key as keyof Usuario]}
                onChangeText={(text) => handleInputChange(campo.key as keyof Usuario, text)}
                multiline={campo.multiline}
              />
            ) : (
              <Text style={[styles.valor, { color: colors.textPrimary }]}>
                {usuario[campo.key as keyof Usuario] || "Não informado"}
              </Text>
            )}
          </View>
        ))}
      </View>

      {isEditing ? (
        <>
          <TouchableOpacity style={styles.botao} onPress={salvarPerfil}>
            <Text style={styles.textoBotao}>💾 Salvar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => setIsEditing(false)}>
            <Text style={styles.textoVoltar}>❌ Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.botao} onPress={() => setIsEditing(true)}>
            <Text style={styles.textoBotao}>✏️ Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoSair} onPress={confirmarLogout}>
            <Text style={styles.textoBotao}>🚪 Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
            <Text style={styles.textoExcluir}>🗑️ Excluir minha conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.replace("/")}>
            <Text style={styles.textoVoltar}>← Voltar para o início</Text>
          </TouchableOpacity>
        </>
      )}
      
      <View style={styles.espacamentoInferior} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTexto: {
    marginTop: 15,
    fontSize: 16,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  acoesCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ola: {
    fontSize: 18,
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
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },
  informacao: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    marginBottom: 3,
  },
  valor: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
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
  botaoSair: {
    backgroundColor: "#777",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
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
  espacamentoInferior: {
    height: 40,
  }
});