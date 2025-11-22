import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth-context";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function LoginScreen({ navigation }) {
  const { login, logout, user, authError, isAuthenticating, initializing } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const userName = useMemo(() => user?.full_name || user?.email || "Usuário", [user]);

  async function handleSubmit() {
    setFormError(null);
    try {
      await login({ email, password });
      setPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível fazer login.";
      setFormError(message);
    }
  }

  if (initializing) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.body}>Preparando ambiente seguro...</Text>
        </View>
      </ScrollView>
    );
  }

  if (user) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.header, baseStyles.section]}>
          <Text style={baseStyles.headerTitle}>Você já está conectado</Text>
          <Text style={baseStyles.headerSubtitle}>
            Continue explorando o catálogo e acompanhe as novidades da sua garagem inteligente.
          </Text>
        </View>
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.body}>
            Logado como <Text style={{ fontWeight: "700", color: colors.primary }}>{userName}</Text>.
          </Text>
          <TouchableOpacity style={[baseStyles.buttonPrimary, { marginTop: 12 }]} onPress={logout}>
            <Text style={baseStyles.buttonTextPrimary}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Entrar</Text>
        <Text style={baseStyles.headerTitle}>Acesse sua conta buyMove</Text>
        <Text style={baseStyles.headerSubtitle}>
          Salve favoritos, sincronize preferências e acompanhe novidades exclusivas sobre novos modelos.
        </Text>
      </View>

      <View style={[baseStyles.card, styles.form]}>
        <View style={styles.fieldGroup}>
          <Text style={baseStyles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={baseStyles.input}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={baseStyles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            style={baseStyles.input}
          />
        </View>

        {(formError || authError) && (
          <Text style={[baseStyles.body, { color: colors.accent }]}>{formError || authError}</Text>
        )}

        <TouchableOpacity
          style={[baseStyles.buttonPrimary, { marginTop: 8 }]}
          disabled={isAuthenticating}
          onPress={handleSubmit}
        >
          <Text style={baseStyles.buttonTextPrimary}>
            {isAuthenticating ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateOrWarn(navigation, "ForgotPassword")}> 
          <Text style={styles.link}>Esqueceu a senha? Recuperar acesso</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateOrWarn(navigation, "Register")}> 
          <Text style={styles.link}>Ainda não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  link: {
    marginTop: 10,
    color: colors.primaryLight,
    fontWeight: "700",
  },
});
