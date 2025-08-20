import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f8fafc",
    fontFamily: "Times-Roman",
  },

  // ===== Header =====
  header: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderBottom: "4px solid #3b82f6",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  estd: {
    fontSize: 12,
    color: "#e2e8f0",
    opacity: 0.9,
    textAlign: "center",
  },

  // ===== Layout =====
  mainContainer: {
    flexDirection: "row",
    gap: 16,
  },
  leftPanel: {
    width: "32%",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },
  rightPanel: {
    width: "68%",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },

  // ===== Left Box =====
  leftBox: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 16,
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  sectionLabel: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#1e3a8a",
    textTransform: "uppercase",
  },
  tag: {
    fontSize: 12,
    padding: 6,
    backgroundColor: "#dbeafe",
    borderRadius: 6,
    marginBottom: 6,
    textAlign: "center",
    color: "#1e40af",
  },

  // ===== Sports (with icons) =====
  sportContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    borderRadius: 6,
    marginBottom: 6,
    padding: 6,
    gap: 6,
  },
  sportIcon: {
    width: 28,
    height: 28,
  },
  sportName: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "bold",
  },

  // ===== Right Panel Sections =====
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e3a8a",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify",
    color: "#334155",
  },
  principalBox: {
    backgroundColor: "#eff6ff",
    padding: 10,
    borderLeft: "4px solid #3b82f6",
    marginTop: 8,
    borderRadius: 6,
  },

  // ===== Statistics =====
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  statCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    textAlign: "center",
    border: "2px solid #1e3a8a",
  },
  statInfrastructure: {
    borderColor: "#d97706",
    color: "#b45309",
  },
  statPlacement: {
    borderColor: "#10b981",
    color: "#047857",
  },
  statAcademic: {
    borderColor: "#6366f1",
    color: "#4338ca",
  },
  statCoCurricular: {
    borderColor: "#ec4899",
    color: "#be185d",
  },
  statPercentage: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#334155",
    textAlign: "center",
  },

  // ===== Footer Info =====
  footerInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  infoTag: {
    backgroundColor: "#bfdbfe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    color: "#1e40af",
  },
});

const sportsIconsList = [
  { file: "/cricket.png", name: "Cricket", key: "cricket" },
  { file: "/lawn_tennis.png", name: "Lawn Tennis", key: "lawn_tennis" },
  { file: "/squash.png", name: "Squash", key: "squash" },
  { file: "/skates.png", name: "Skating", key: "skating" },
  { file: "/football.png", name: "Football", key: "football" },
  { file: "/horse_riding.png", name: "Horse Riding", key: "horse_riding" },
  { file: "/basketball.png", name: "Basketball", key: "basketball" },
  { file: "/badminton.png", name: "Badminton", key: "badminton" },
  { file: "/shooting.png", name: "Shooting", key: "shooting" },
  { file: "/swiming.png", name: "Swimming", key: "swimming" },
  { file: "/tt.png", name: "Table Tennis", key: "table_tennis" },
];

const SchoolPDF = ({ schools }) => (
  <Document>
    {schools.map((school, index) => (
      <Page key={index} size="A4" style={styles.page}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{school.schoolName}</Text>
          <Text style={styles.estd}>
            Established {school.establishedYear || "—"}
          </Text>
        </View>

        <View style={styles.mainContainer}>
          {/* ===== Left Panel ===== */}
          <View style={styles.leftPanel}>
            <Text style={styles.leftBox}>
              {school.className} {"\n"}₹ {school.schoolBudget}
            </Text>

            <Text style={styles.sectionLabel}>School Classes</Text>
            <Text style={styles.tag}>
              From {school.classFrom || "—"} To {school.classTo || "—"}
            </Text>

            <Text style={styles.sectionLabel}>Sports</Text>
            {sportsIconsList
              .filter(
                (icon) =>
                  school[icon.key] && school[icon.key].toLowerCase() === "yes"
              )
              .map((icon, i) => (
                <View key={i} style={styles.sportContainer}>
                  <Image src={icon.file} style={styles.sportIcon} />
                  <Text style={styles.sportName}>{icon.name}</Text>
                </View>
              ))}
          </View>

          {/* ===== Right Panel ===== */}
          <View style={styles.rightPanel}>
            {/* About School */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About School</Text>
              <Text style={styles.paragraph}>
                {school.about ||
                  "No description available. Add school description here."}
              </Text>
            </View>

            {/* Principal&apos;s Message */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Principal&apos;s Message | {school.principal || "—"}
              </Text>
              <View style={styles.principalBox}>
                <Text style={styles.paragraph}>
                  {school.principalMessage ||
                    "Principal's vision and mission go here."}
                </Text>
              </View>
            </View>

            {/* School Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>School Statistics</Text>
              <View style={styles.statsContainer}>
                {/* Infrastructure */}
                <View style={styles.statItem}>
                  <View style={[styles.statCircle, styles.statInfrastructure]}>
                    <Text style={styles.statPercentage}>
                      {school.infrastructure || "—"}%
                    </Text>
                  </View>
                  <Text style={styles.statLabel}>Infrastructure</Text>
                </View>

                {/* Placement */}
                <View style={styles.statItem}>
                  <View style={[styles.statCircle, styles.statPlacement]}>
                    <Text style={styles.statPercentage}>
                      {school.placement || "—"}%
                    </Text>
                  </View>
                  <Text style={styles.statLabel}>Placement</Text>
                </View>

                {/* Academic */}
                <View style={styles.statItem}>
                  <View style={[styles.statCircle, styles.statAcademic]}>
                    <Text style={styles.statPercentage}>
                      {school.academicReputation || "—"}%
                    </Text>
                  </View>
                  <Text style={styles.statLabel}>Academic</Text>
                </View>

                {/* CoCurricular */}
                <View style={styles.statItem}>
                  <View style={[styles.statCircle, styles.statCoCurricular]}>
                    <Text style={styles.statPercentage}>
                      {school.co_curricular_activities || "—"}%
                    </Text>
                  </View>
                  <Text style={styles.statLabel}>CoCurricular</Text>
                </View>
              </View>
            </View>

            {/* Footer Info */}
            <View style={styles.footerInfo}>
              {(school.boards || []).map((b, i) => (
                <Text key={i} style={styles.infoTag}>
                  {b}
                </Text>
              ))}
              <Text style={styles.infoTag}>{school.schoolType || "—"}</Text>
              <Text style={styles.infoTag}>{school.gender || "—"}</Text>
            </View>
          </View>
        </View>
      </Page>
    ))}
  </Document>
);

export default SchoolPDF;
