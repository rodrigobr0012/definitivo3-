import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { resetPassword } from "@/services/auth";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function ResetPasswordScreen({ navigation, route }) {
  const token = useMemo(() => route?.params?.token ?? "", [route?.params?.token]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const canSubmit = Boolean(token && password && confirmPassword && password === confirmPassword);

  async function handleSubmit() {
    if (!canSubmit) return;
    setStatus("submitting");
    setMessage(null);
    try {
      await resetPassword({ token, password });
      setStatus("success");
      setMessage("Senha redefinida com sucesso. Agora você pode acessar sua conta normalmente.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigateOrWarn(navigation, "Login"), 800);
    } catch (error) {
      setStatus("error");
      setMessage(error.message ?? "Não foi possível redefinir a senha agora.");
    }
  }

  if (!token) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.body}>
            Nenhum token de recuperação foi informado. Solicite um novo link de redefinição na página de recuperação de senha.
          </Text>
          <TouchableOpacity
            style={[baseStyles.buttonPrimary, { marginTop: 12 }]}
            onPress={() => navigateOrWarn(navigation, "ForgotPassword")}
          >
            <Text style={baseStyles.buttonTextPrimary}>Recuperar senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Nova senha</Text>
        <Text style={baseStyles.headerTitle}>Defina uma senha segura</Text>
        <Text style={baseStyles.headerSubtitle}>
          Escolha uma senha com pelo menos 8 caracteres para voltar a acessar sua conta com segurança.
        </Text>
      </View>

      <View style={[baseStyles.card, styles.form]}>
        <View style={styles.fieldGroup}>
          <Text style={baseStyles.label}>Nova senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Crie uma nova senha"
            secureTextEntry
            style={baseStyles.input}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={baseStyles.label}>Confirmar senha</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repita a nova senha"
            secureTextEntry
            style={baseStyles.input}
          />
        </View>

        {password && confirmPassword && password !== confirmPassword && (
          <Text style={[baseStyles.body, { color: "#b45309" }]}>As senhas precisam ser iguais.</Text>
        )}

        {message && (
          <Text style={[baseStyles.body, { color: status === "error" ? colors.accent : "#047857" }]}>{message}</Text>
        )}

        <TouchableOpacity
          style={[baseStyles.buttonPrimary, { marginTop: 8 }]}
          disabled={!canSubmit || status === "submitting"}
          onPress={handleSubmit}
        >
          <Text style={baseStyles.buttonTextPrimary}>
            {status === "submitting" ? "Salvando..." : "Salvar nova senha"}
          </Text>
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
});
