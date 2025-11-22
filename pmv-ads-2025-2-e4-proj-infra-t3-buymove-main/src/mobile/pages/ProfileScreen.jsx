import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useAuth } from "@/context/auth-context";
import { baseStyles, colors } from "./common";

const storage = typeof globalThis !== "undefined" ? globalThis.localStorage : undefined;

const readValue = (key, fallback = "") => (storage ? storage.getItem(key) || fallback : fallback);

export default function ProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState(() => readValue("bm_profile_name"));
  const [phone, setPhone] = useState(() => readValue("bm_profile_phone"));
  const [notify, setNotify] = useState(() => readValue("bm_profile_notify", "true") !== "false");
  const [whatsapp, setWhatsapp] = useState(() => readValue("bm_profile_whatsapp", "false") === "true");
  const [notes, setNotes] = useState(() => readValue("bm_profile_notes"));
  const [feedback, setFeedback] = useState("");

  const lastUpdateRaw = useMemo(() => readValue("bm_profile_updated_at"), []);
  const lastUpdate = lastUpdateRaw
    ? new Date(lastUpdateRaw).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "Ainda não salvo";

  function persist() {
    if (storage) {
      storage.setItem("bm_profile_name", name.trim());
      storage.setItem("bm_profile_phone", phone.trim());
      storage.setItem("bm_profile_notify", String(notify));
      storage.setItem("bm_profile_whatsapp", String(whatsapp));
      storage.setItem("bm_profile_notes", notes.trim());
      storage.setItem("bm_profile_updated_at", new Date().toISOString());
    }
    setFeedback("Dados atualizados com sucesso!");
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleReset() {
    setName(readValue("bm_profile_name"));
    setPhone(readValue("bm_profile_phone"));
    setNotify(readValue("bm_profile_notify", "true") !== "false");
    setWhatsapp(readValue("bm_profile_whatsapp", "false") === "true");
    setNotes(readValue("bm_profile_notes"));
    setFeedback("Alterações desfeitas.");
    setTimeout(() => setFeedback(""), 4000);
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Meu cadastro</Text>
        <Text style={baseStyles.headerTitle}>Dados da conta buyMove</Text>
        <Text style={baseStyles.headerSubtitle}>
          Mantenha suas informações e preferências atualizadas para receber ofertas e alertas relevantes.
        </Text>
      </View>

      {feedback ? (
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={[baseStyles.body, { color: "#047857" }]}>{feedback}</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        <View style={[baseStyles.card, styles.card]}>
          <Text style={baseStyles.heading}>Dados pessoais</Text>
          <View style={styles.fieldGroup}>
            <Text style={baseStyles.label}>Nome completo</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              style={baseStyles.input}
            />
          </View>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={baseStyles.label}>Telefone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="(00) 90000-0000"
                keyboardType="phone-pad"
                style={baseStyles.input}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={baseStyles.label}>Observações rápidas</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Anote detalhes importantes sobre o que procura."
                multiline
                numberOfLines={4}
                style={[baseStyles.input, styles.textArea]}
              />
            </View>
          </View>
        </View>

        <View style={[baseStyles.card, styles.card]}>
          <Text style={baseStyles.heading}>Preferências de contato</Text>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={baseStyles.body}>Receber alertas por e-mail quando um favorito mudar de preço.</Text>
            </View>
            <Switch value={notify} onValueChange={setNotify} thumbColor={colors.primaryLight} />
          </View>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={baseStyles.body}>Permitir contato via WhatsApp pelo número informado.</Text>
            </View>
            <Switch value={whatsapp} onValueChange={setWhatsapp} thumbColor={colors.primaryLight} />
          </View>
          <Text style={baseStyles.mutedText}>
            Nunca compartilhamos seu contato sem autorização. Ajuste suas preferências quando quiser.
          </Text>
        </View>
      </View>

      <View style={[styles.summary, baseStyles.section]}>
        <View style={[baseStyles.card, { flex: 1 }]}> 
          <Text style={baseStyles.heading}>Resumo da conta</Text>
          <View style={{ gap: 6 }}>
            <Text style={baseStyles.body}>E-mail conectado: {user?.email || "não informado"}</Text>
            <Text style={baseStyles.body}>Status das notificações: {notify ? "Ativas" : "Inativas"}</Text>
            <Text style={baseStyles.body}>Contato via WhatsApp: {whatsapp ? "Permitido" : "Desativado"}</Text>
            <Text style={baseStyles.body}>Última atualização: {lastUpdate}</Text>
          </View>
        </View>
        <View style={{ gap: 8, flex: 1 }}>
          <TouchableOpacity style={baseStyles.buttonPrimary} onPress={persist}>
            <Text style={baseStyles.buttonTextPrimary}>Salvar alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={baseStyles.buttonSecondary} onPress={handleReset}>
            <Text style={baseStyles.buttonTextSecondary}>Desfazer mudanças</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  summary: {
    flexDirection: "row",
    gap: 12,
  },
});
