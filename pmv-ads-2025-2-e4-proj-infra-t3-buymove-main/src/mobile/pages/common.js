import { StyleSheet } from "react-native";

export const colors = {
  primary: "#0f172a",
  primaryLight: "#1d4ed8",
  accent: "#ef4444",
  muted: "#475569",
  border: "#e2e8f0",
  background: "#f8fafc",
};

export const baseStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  headerKicker: {
    color: "#bfdbfe",
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#e2e8f0",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondary: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDanger: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextPrimary: {
    color: "white",
    fontWeight: "700",
  },
  buttonTextSecondary: {
    color: colors.primary,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.primary,
    backgroundColor: "white",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 6,
  },
  mutedText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  chip: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  chipText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
});

export function navigateOrWarn(navigation, routeName) {
  if (navigation?.navigate) {
    navigation.navigate(routeName);
  }
}
