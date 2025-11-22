import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { requestPasswordReset } from "@/services/auth";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    if (!email) return;
    setStatus("submitting");
    setMessage(null);
    try {
      await requestPasswordReset({ email });
      setStatus("success");
      setMessage("Enviamos instruções para o seu e-mail. Caso esteja cadastrado, você receberá um link em instantes.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message ?? "Não foi possível iniciar a recuperação agora.");
    }
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Recuperar acesso</Text>
        <Text style={baseStyles.headerTitle}>Vamos enviar um link seguro</Text>
        <Text style={baseStyles.headerSubtitle}>
          Informe o e-mail cadastrado e enviaremos um link para redefinir a sua senha.
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

        {message && (
          <Text style={[baseStyles.body, { color: status === "error" ? colors.accent : "#047857" }]}>{message}</Text>
        )}

        <TouchableOpacity
          style={[baseStyles.buttonPrimary, { marginTop: 8 }]}
          disabled={status === "submitting"}
          onPress={handleSubmit}
        >
          <Text style={baseStyles.buttonTextPrimary}>
            {status === "submitting" ? "Enviando..." : "Enviar link"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateOrWarn(navigation, "Login")}>
          <Text style={styles.link}>Lembrou a senha? Voltar para a tela de login</Text>
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
    marginTop: 12,
    color: colors.primaryLight,
    fontWeight: "700",
  },
});
