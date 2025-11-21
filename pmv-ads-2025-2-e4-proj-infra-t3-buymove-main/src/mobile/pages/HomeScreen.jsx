import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { baseStyles, colors, navigateOrWarn } from "./common";

const highlights = [
  {
    title: "Comparação transparente",
    description:
      "Acesse preços oficiais e ofertas atualizadas de concessionárias e lojas parceiras.",
  },
  {
    title: "Filtro inteligente",
    description: "Refine por categoria, faixa de preço, consumo e tecnologia embarcada.",
  },
  {
    title: "Favoritos sincronizados",
    description: "Salve modelos para revisar depois e compartilhe com quem decide junto com você.",
  },
];

const steps = [
  {
    number: "1",
    title: "Explore o catálogo",
    description: "Pesquise por marca, modelo ou palavra-chave em segundos.",
  },
  {
    number: "2",
    title: "Compare o que importa",
    description: "Analise preços, versões e itens de série lado a lado.",
  },
  {
    number: "3",
    title: "Salve seus favoritos",
    description: "Monte uma lista personalizada e retome quando quiser.",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, styles.hero]}>
        <Text style={baseStyles.headerKicker}>Seu guia de compra inteligente</Text>
        <Text style={baseStyles.headerTitle}>Bem-vindo ao buyMove</Text>
        <Text style={baseStyles.headerSubtitle}>
          Descubra o veículo ideal comparando preços, características e avaliações em poucos toques.
          Quando estiver pronto, avance para a compra com um clique.
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[baseStyles.buttonPrimary, styles.button]}
            onPress={() => navigateOrWarn(navigation, "Catalog")}
          >
            <Text style={baseStyles.buttonTextPrimary}>Explorar catálogo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[baseStyles.buttonSecondary, styles.button]}
            onPress={() => navigateOrWarn(navigation, "Favorites")}
          >
            <Text style={baseStyles.buttonTextSecondary}>Ver favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[baseStyles.buttonDanger, styles.button]}
            onPress={() => navigateOrWarn(navigation, "VehicleCreate")}
          >
            <Text style={baseStyles.buttonTextPrimary}>Anunciar veículo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={baseStyles.section}>
        <Text style={baseStyles.heading}>Por que escolher o buyMove?</Text>
        <Text style={[baseStyles.body, { marginBottom: 12 }]}>
          Reunimos dados confiáveis e ferramentas simples para que você tome decisões com segurança e economia.
        </Text>
        <View style={styles.cardGrid}>
          {highlights.map(({ title, description }, index) => (
            <View key={title} style={[baseStyles.card, styles.card]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{String(index + 1).padStart(2, "0")}</Text>
              </View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={baseStyles.body}>{description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[baseStyles.card, baseStyles.section]}>
        <Text style={baseStyles.heading}>Como funciona</Text>
        <Text style={[baseStyles.body, { marginBottom: 16 }]}>
          Em poucos passos você encontra, compara e salva os veículos que combinam com a sua realidade.
        </Text>
        {steps.map(({ number, title, description }) => (
          <View key={title} style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={baseStyles.body}>{description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  button: {
    minWidth: 160,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flexBasis: "48%",
    minWidth: 160,
  },
  badge: {
    backgroundColor: "#e0f2fe",
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: colors.primaryLight,
    fontWeight: "700",
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: colors.primaryLight,
    fontWeight: "800",
  },
});
