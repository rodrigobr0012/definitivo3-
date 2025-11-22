import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useFavorites } from "@/context/favorites-context";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite, updateFavorite, loading, error } = useFavorites();

  if (loading) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.body}>Carregando seus favoritos...</Text>
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={[baseStyles.body, { color: colors.accent }]}>
            Não foi possível carregar seus favoritos: {error}
          </Text>
        </View>
      </ScrollView>
    );
  }

  if (!favorites.length) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.header, baseStyles.section]}>
          <Text style={baseStyles.headerTitle}>Sem favoritos por enquanto</Text>
          <Text style={baseStyles.headerSubtitle}>
            Salve os modelos que mais chamarem sua atenção para comparar depois com calma.
          </Text>
          <TouchableOpacity
            style={[baseStyles.buttonPrimary, { marginTop: 12, alignSelf: "flex-start" }]}
            onPress={() => navigateOrWarn(navigation, "Catalog")}
          >
            <Text style={baseStyles.buttonTextPrimary}>Ir para o catálogo</Text>
          </TouchableOpacity>
        </View>

        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.body}>
            Quando você favoritar um veículo, ele aparece aqui com acesso rápido aos detalhes, anotações e contato com o vendedor.
          </Text>
        </View>
      </ScrollView>
    );
  }

  function handleContact(vehicle) {
    Alert.alert("Contato", `Entraremos em contato sobre ${vehicle.title}.`);
  }

  function handleNote(vehicle) {
    const nextNote = vehicle.note ? `${vehicle.note} (editado)` : "Observação rápida";
    updateFavorite(vehicle.id, { note: nextNote });
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Favoritos</Text>
        <Text style={baseStyles.headerTitle}>Sua garagem inteligente</Text>
        <Text style={baseStyles.headerSubtitle}>
          Organize modelos, registre observações e avance para a compra assim que estiver pronto.
        </Text>
      </View>

      {favorites.map((vehicle) => (
        <View key={vehicle.id} style={[baseStyles.card, styles.vehicle]}>
          {vehicle.imageUrl ? (
            <Image source={{ uri: vehicle.imageUrl }} style={styles.image} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{vehicle.title}</Text>
            <Text style={baseStyles.body}>
              {vehicle.brand} - {vehicle.year}
            </Text>
            <Text style={styles.price}>R$ {Number(vehicle.price).toLocaleString("pt-BR")}</Text>
            {vehicle.note ? (
              <Text style={[baseStyles.mutedText, { marginTop: 6 }]}>Observação: {vehicle.note}</Text>
            ) : null}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[baseStyles.buttonSecondary, styles.actionButton]} onPress={() => handleContact(vehicle)}>
              <Text style={baseStyles.buttonTextSecondary}>Contatar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[baseStyles.buttonPrimary, styles.actionButton]} onPress={() => handleNote(vehicle)}>
              <Text style={baseStyles.buttonTextPrimary}>Guardar nota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[baseStyles.buttonDanger, styles.actionButton]} onPress={() => removeFavorite(vehicle.id)}>
              <Text style={baseStyles.buttonTextPrimary}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vehicle: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  image: {
    width: 96,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 4,
  },
  actions: {
    gap: 6,
    marginLeft: 8,
    flexBasis: 140,
  },
  actionButton: {
    paddingHorizontal: 12,
  },
});
