import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth-context";
import { registerUser } from "@/services/auth";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function RegisterScreen({ navigation }) {
  const { login, logout, user, isAuthenticating, initializing } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = useMemo(() => user?.full_name || user?.email || "Usuário", [user]);

  async function handleSubmit() {
    setFormError(null);
    setSuccessMessage("");

    if (password.length < 8) {
      setFormError("A senha deve conter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas informadas não são iguais.");
      return;
    }

    const payload = {
      email: email.trim().toLowerCase(),
      password,
      ...(fullName.trim() ? { full_name: fullName.trim() } : {}),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(document.trim() ? { document: document.trim() } : {}),
    };

    setIsSubmitting(true);
    try {
      await registerUser(payload);
      setSuccessMessage("Cadastro concluído com sucesso! Estamos entrando na sua nova conta.");
      await login({ email: payload.email, password });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir seu cadastro.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
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
          <Text style={baseStyles.headerTitle}>Conta pronta para uso</Text>
          <Text style={baseStyles.headerSubtitle}>
            {successMessage
              ? successMessage
              : "Você já concluiu o cadastro e pode aproveitar todos os recursos da buyMove."}
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
        <Text style={baseStyles.headerKicker}>Criar conta</Text>
        <Text style={baseStyles.headerTitle}>Cadastre-se na buyMove em poucos passos</Text>
        <Text style={baseStyles.headerSubtitle}>
          Salve veículos favoritos, receba alertas personalizados e gerencie seu histórico em um só lugar.
        </Text>
      </View>

      <View style={[baseStyles.card, styles.form]}>
        <LabeledInput label="Nome completo" value={fullName} onChangeText={setFullName} placeholder="Como devemos te chamar?" />
        <LabeledInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <LabeledInput
          label="Telefone (opcional)"
          value={phone}
          onChangeText={setPhone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
        />
        <LabeledInput
          label="CPF ou CNPJ (opcional)"
          value={document}
          onChangeText={setDocument}
          placeholder="000.000.000-00"
        />
        <LabeledInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Crie uma senha forte"
          secureTextEntry
        />
        <LabeledInput
          label="Confirme a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repita a senha"
          secureTextEntry
        />

        {(formError || successMessage) && (
          <Text style={[baseStyles.body, { color: formError ? colors.accent : "#047857" }]}>
            {formError || successMessage}
          </Text>
        )}

        <TouchableOpacity
          style={[baseStyles.buttonPrimary, { marginTop: 8 }]}
          disabled={isSubmitting || isAuthenticating}
          onPress={handleSubmit}
        >
          <Text style={baseStyles.buttonTextPrimary}>
            {isSubmitting || isAuthenticating ? "Processando cadastro..." : "Criar conta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateOrWarn(navigation, "Login")}>
          <Text style={styles.link}>Já possui uma conta? Fazer login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function LabeledInput({ label, ...inputProps }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={baseStyles.label}>{label}</Text>
      <TextInput {...inputProps} style={baseStyles.input} />
    </View>
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
    marginTop: 12,
    color: colors.primaryLight,
    fontWeight: "700",
  },
});
