import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/auth-context";
import { deleteVehicle, listUserVehicles, normalizeVehicle, updateVehicle } from "@/services/vehicles";
import { baseStyles, colors, navigateOrWarn } from "./common";

export default function MyVehiclesScreen({ navigation }) {
  const { user, initializing } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState("");

  const isLogged = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    if (!isLogged) return;

    async function fetchVehicles() {
      setLoading(true);
      setError(null);
      try {
        const { items } = await listUserVehicles();
        setVehicles(items.map(normalizeVehicle));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar seus anúncios.");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [isLogged]);

  function startEdit(vehicle) {
    setEditingId(vehicle.id);
    setSuccess("");
    setFormData({
      title: vehicle.title || "",
      price: String(vehicle.price ?? ""),
      mileage: String(vehicle.mileage ?? ""),
      location: vehicle.location || "",
      imageUrl: vehicle.imageUrl || "",
    });
  }

  function handleChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate() {
    if (!editingId) return;

    try {
      const payload = {
        title: formData.title?.trim() || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        location: formData.location?.trim() || undefined,
        images: formData.imageUrl?.trim() ? [formData.imageUrl.trim()] : undefined,
      };

      const updated = await updateVehicle(editingId, payload);
      setVehicles((prev) => prev.map((item) => (item.id === editingId ? normalizeVehicle(updated) : item)));
      setSuccess("Anúncio atualizado com sucesso.");
      setEditingId(null);
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o anúncio.");
    }
  }

  async function handleDelete(id) {
    Alert.alert("Remover anúncio", "Tem certeza que deseja remover este anúncio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteVehicle(id);
            setVehicles((prev) => prev.filter((item) => item.id !== id));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Não foi possível remover o anúncio.");
          }
        },
      },
    ]);
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

  if (!isLogged) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.header, baseStyles.section]}>
          <Text style={baseStyles.headerTitle}>Meus anúncios</Text>
          <Text style={baseStyles.headerSubtitle}>
            Faça login para acompanhar, editar ou remover veículos cadastrados.
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <TouchableOpacity
              style={[baseStyles.buttonPrimary, { flex: 1 }]}
              onPress={() => navigateOrWarn(navigation, "Login")}
            >
              <Text style={baseStyles.buttonTextPrimary}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[baseStyles.buttonSecondary, { flex: 1 }]}
              onPress={() => navigateOrWarn(navigation, "Register")}
            >
              <Text style={baseStyles.buttonTextSecondary}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Veículos cadastrados</Text>
        <Text style={baseStyles.headerTitle}>Gerencie seus anúncios</Text>
        <Text style={baseStyles.headerSubtitle}>
          Altere preços, atualize fotos ou remova anúncios que não fazem mais sentido no catálogo.
        </Text>
      </View>

      {success ? (
        <Text style={[baseStyles.body, { color: "#047857" }]}>{success}</Text>
      ) : null}
      {error ? (
        <Text style={[baseStyles.body, { color: colors.accent }]}>{error}</Text>
      ) : null}

      {loading && <Text style={baseStyles.body}>Carregando seus veículos...</Text>}

      {!loading && !vehicles.length && (
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.heading}>Nenhum anúncio por aqui</Text>
          <Text style={baseStyles.body}>Publique seu primeiro veículo para vê-lo listado aqui.</Text>
          <TouchableOpacity
            style={[baseStyles.buttonPrimary, { marginTop: 10, alignSelf: "flex-start" }]}
            onPress={() => navigateOrWarn(navigation, "VehicleCreate")}
          >
            <Text style={baseStyles.buttonTextPrimary}>Criar anúncio</Text>
          </TouchableOpacity>
        </View>
      )}

      {vehicles.map((vehicle) => (
        <View key={vehicle.id} style={[baseStyles.card, styles.card]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{vehicle.title}</Text>
            <Text style={baseStyles.body}>
              {vehicle.brand} • {vehicle.year} • R$ {Number(vehicle.price).toLocaleString("pt-BR")}
            </Text>
            {editingId === vehicle.id ? (
              <View style={{ gap: 8, marginTop: 8 }}>
                <EditableField
                  label="Título"
                  value={formData.title}
                  onChangeText={(text) => handleChange("title", text)}
                />
                <EditableField
                  label="Preço"
                  value={formData.price}
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("price", text)}
                />
                <EditableField
                  label="Quilometragem"
                  value={formData.mileage}
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("mileage", text)}
                />
                <EditableField
                  label="Localização"
                  value={formData.location}
                  onChangeText={(text) => handleChange("location", text)}
                />
                <EditableField
                  label="Imagem"
                  value={formData.imageUrl}
                  onChangeText={(text) => handleChange("imageUrl", text)}
                />
              </View>
            ) : null}
          </View>
          <View style={styles.actions}>
            {editingId === vehicle.id ? (
              <TouchableOpacity style={baseStyles.buttonPrimary} onPress={handleUpdate}>
                <Text style={baseStyles.buttonTextPrimary}>Salvar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={baseStyles.buttonSecondary} onPress={() => startEdit(vehicle)}>
                <Text style={baseStyles.buttonTextSecondary}>Editar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={baseStyles.buttonDanger} onPress={() => handleDelete(vehicle.id)}>
              <Text style={baseStyles.buttonTextPrimary}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function EditableField({ label, ...inputProps }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={baseStyles.label}>{label}</Text>
      <TextInput {...inputProps} style={baseStyles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  actions: {
    gap: 8,
    width: 120,
  },
  fieldGroup: {
    gap: 4,
  },
});
