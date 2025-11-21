import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth-context";
import { createVehicle } from "@/services/vehicles";
import { baseStyles, colors, navigateOrWarn } from "./common";

const initialFormState = {
  title: "",
  brand: "",
  model: "",
  version: "",
  year: "2023",
  price: "",
  mileage: "0",
  color: "",
  fuel_type: "",
  transmission: "",
  doors: "4",
  location: "",
  description: "",
  imageUrl: "",
  features: "",
};

export default function VehicleCreateScreen({ navigation }) {
  const { user, initializing } = useAuth();

  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (initializing) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.card, baseStyles.section]}>
          <Text style={baseStyles.body}>Preparando ambiente seguro...</Text>
        </View>
      </ScrollView>
    );
  }

  if (!user) {
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
        <View style={[baseStyles.header, baseStyles.section]}>
          <Text style={baseStyles.headerTitle}>Faça login para anunciar</Text>
          <Text style={baseStyles.headerSubtitle}>Apenas usuários autenticados podem publicar anúncios no catálogo.</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <TouchableOpacity style={[baseStyles.buttonPrimary, { flex: 1 }]} onPress={() => navigateOrWarn(navigation, "Login")}>
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

  function handleChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setFormError(null);
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.brand.trim() || !formData.price) {
      setFormError("Título, marca e preço são obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim() || undefined,
        version: formData.version.trim() || undefined,
        year: Number(formData.year) || new Date().getFullYear(),
        price: Number(formData.price),
        mileage: Number(formData.mileage) || 0,
        color: formData.color.trim() || undefined,
        fuel_type: formData.fuel_type.trim() || undefined,
        transmission: formData.transmission.trim() || undefined,
        doors: formData.doors ? Number(formData.doors) : undefined,
        location: formData.location.trim() || undefined,
        description: formData.description.trim() || undefined,
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
        features: formData.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createVehicle(payload);
      setSuccessMessage("Veículo cadastrado com sucesso! Você pode acompanhá-lo em Meus anúncios.");
      setFormData(initialFormState);
      navigateOrWarn(navigation, "MyVehicles");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar seu veículo.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={baseStyles.content}>
      <View style={[baseStyles.header, baseStyles.section]}>
        <Text style={baseStyles.headerKicker}>Anunciar veículo</Text>
        <Text style={baseStyles.headerTitle}>Publique seu anúncio em minutos</Text>
        <Text style={baseStyles.headerSubtitle}>
          Preencha os detalhes do veículo e ele aparecerá automaticamente no catálogo para compradores interessados.
        </Text>
      </View>

      <View style={[baseStyles.card, styles.form]}>
        <FormRow>
          <LabeledInput label="Título do anúncio" value={formData.title} onChangeText={(text) => handleChange("title", text)} />
          <LabeledInput label="Marca" value={formData.brand} onChangeText={(text) => handleChange("brand", text)} />
        </FormRow>

        <FormRow>
          <LabeledInput label="Modelo" value={formData.model} onChangeText={(text) => handleChange("model", text)} />
          <LabeledInput label="Versão" value={formData.version} onChangeText={(text) => handleChange("version", text)} />
        </FormRow>

        <FormRow>
          <LabeledInput label="Ano" value={formData.year} keyboardType="numeric" onChangeText={(text) => handleChange("year", text)} />
          <LabeledInput label="Preço (R$)" value={formData.price} keyboardType="numeric" onChangeText={(text) => handleChange("price", text)} />
          <LabeledInput label="Quilometragem" value={formData.mileage} keyboardType="numeric" onChangeText={(text) => handleChange("mileage", text)} />
          <LabeledInput label="Portas" value={formData.doors} keyboardType="numeric" onChangeText={(text) => handleChange("doors", text)} />
        </FormRow>

        <FormRow>
          <LabeledInput label="Cor" value={formData.color} onChangeText={(text) => handleChange("color", text)} />
          <LabeledInput label="Combustível" value={formData.fuel_type} onChangeText={(text) => handleChange("fuel_type", text)} />
          <LabeledInput label="Câmbio" value={formData.transmission} onChangeText={(text) => handleChange("transmission", text)} />
        </FormRow>

        <LabeledInput
          label="Localização"
          value={formData.location}
          onChangeText={(text) => handleChange("location", text)}
          placeholder="Cidade - UF"
        />

        <LabeledInput
          label="URL da imagem principal"
          value={formData.imageUrl}
          onChangeText={(text) => handleChange("imageUrl", text)}
          placeholder="https://"
        />

        <LabeledInput
          label="Destaques (separados por vírgula)"
          value={formData.features}
          onChangeText={(text) => handleChange("features", text)}
          placeholder="Bancos em couro, revisões em dia, único dono"
        />

        <View style={styles.fieldGroup}>
          <Text style={baseStyles.label}>Descrição</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            placeholder="Conte a história do veículo"
            multiline
            numberOfLines={4}
            style={[baseStyles.input, styles.textArea]}
          />
        </View>

        {formError && <Text style={[baseStyles.body, { color: colors.accent }]}>{formError}</Text>}
        {successMessage && <Text style={[baseStyles.body, { color: "#047857" }]}>{successMessage}</Text>}

        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <TouchableOpacity style={[baseStyles.buttonPrimary, styles.button]} disabled={submitting} onPress={handleSubmit}>
            <Text style={baseStyles.buttonTextPrimary}>
              {submitting ? "Enviando anúncio..." : "Publicar anúncio"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[baseStyles.buttonSecondary, styles.button]}
            onPress={() => navigateOrWarn(navigation, "MyVehicles")}
          >
            <Text style={baseStyles.buttonTextSecondary}>Ver meus anúncios</Text>
          </TouchableOpacity>
        </View>
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

function FormRow({ children }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fieldGroup: {
    gap: 6,
    flex: 1,
    minWidth: 140,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    flexGrow: 1,
    minWidth: 160,
  },
});
