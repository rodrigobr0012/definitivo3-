import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  FlatList,
} from "react-native";
import { listVehicles } from "@/services/vehicles";
import { useFetch } from "@/hooks/useFetch";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function CatalogScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [quickView, setQuickView] = useState(false);

  const fetcher = useMemo(
    () => () =>
      listVehicles({
        q,
        brand,
        location,
        page: 1,
        pageSize: 12,
      }),
    [q, brand, location]
  );

  const { data, loading, error } = useFetch(fetcher, [fetcher]);
  const items = data?.items ?? [];
  const hasResults = !loading && !error && items.length > 0;

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Catálogo buyMove</Text>
        <Text style={baseStyles.headerTitle}>Compare modelos em segundos</Text>
        <Text style={baseStyles.headerSubtitle}>
          Use a busca inteligente e os filtros principais para chegar rapidamente aos veículos que combinam com o seu perfil.
        </Text>
        <TouchableOpacity
          style={[baseStyles.buttonDanger, styles.cta]}
          onPress={() => navigateOrWarn(navigation, "VehicleCreate")}
        >
          <Text style={baseStyles.buttonTextPrimary}>Anunciar um veículo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={[baseStyles.card, styles.filterCard]}>
          <Text style={baseStyles.heading}>Filtros rápidos</Text>
          <Text style={[baseStyles.body, { marginBottom: 12 }]}>Atualiza em tempo real conforme você digita.</Text>

          <View style={styles.fieldGroup}>
            <Text style={baseStyles.label}>Busca por palavra-chave</Text>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="SUV híbrido, sedan, hatch..."
              style={baseStyles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={baseStyles.label}>Marca</Text>
            <TextInput
              value={brand}
              onChangeText={setBrand}
              placeholder="Toyota, BMW, Hyundai..."
              style={baseStyles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={baseStyles.label}>Localização</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Cidade ou estado"
              style={baseStyles.input}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={baseStyles.label}>Modo rápido</Text>
            <Switch value={quickView} onValueChange={setQuickView} thumbColor={colors.primaryLight} />
          </View>
        </View>

        <View style={[baseStyles.card, styles.tipCard]}>
          <Text style={styles.tipTitle}>Dica</Text>
          <Text style={baseStyles.body}>
            Combine filtros de preço com localização para descobrir ofertas exclusivas perto de você.
          </Text>
        </View>
      </View>

      {loading && <Text style={baseStyles.body}>Carregando resultados...</Text>}
      {error && (
        <Text style={[baseStyles.body, { color: colors.accent }]}>
          Erro ao carregar: {String(error.message || error)}
        </Text>
      )}

      {hasResults && (
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={[baseStyles.mutedText, { marginBottom: 8 }]}>
            {items.length} {items.length === 1 ? "modelo" : "modelos"} encontrados
          </Text>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={[styles.vehicleCard, quickView ? styles.vehicleCardCompact : null]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehicleTitle}>{item.title}</Text>
                  <Text style={baseStyles.body}>
                    {item.brand} • {item.year} • R$ {Number(item.price).toLocaleString("pt-BR")}
                  </Text>
                  {item.location ? (
                    <Text style={baseStyles.mutedText}>Localização: {item.location}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={[baseStyles.buttonSecondary, styles.cardButton]}
                  onPress={() => navigateOrWarn(navigation, "Favorites")}
                >
                  <Text style={baseStyles.buttonTextSecondary}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      )}

      {!loading && !error && !items.length && (
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.heading}>Nada por aqui ainda</Text>
          <Text style={baseStyles.body}>
            Ajuste a busca ou limpe alguns filtros para ver mais opções.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: 12,
    marginBottom: 16,
  },
  filterCard: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  tipTitle: {
    fontWeight: "700",
    color: colors.primaryLight,
    marginBottom: 6,
  },
  cta: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  vehicleCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  vehicleCardCompact: {
    paddingVertical: 4,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  cardButton: {
    paddingHorizontal: 16,
  },
});
