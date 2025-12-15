import { Magasin } from "@/Types/merchantType";
import { Stock } from "@/Types/Stock";
import { Directory, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Download, FileText } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface ReportGeneratorProps {
  store: Magasin;
  products: Stock[];
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  store,
  products,
  onClose,
}) => {
  const [generating, setGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<"pdf" | "word" | null>(
    null
  );

  const generatePDFReport = async () => {
    try {
      setGenerating(true);
      setGeneratingType("pdf");

      const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .title { font-size: 24px; font-weight: bold; color: #079C48; }
                        .subtitle { font-size: 18px; color: #666; margin-top: 10px; }
                        .section { margin-bottom: 25px; }
                        .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; border-bottom: 2px solid #079C48; padding-bottom: 5px; }
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                        .info-item { margin-bottom: 10px; }
                        .info-label { font-weight: bold; color: #555; }
                        .info-value { color: #333; }
                        .product-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        .product-table th { background-color: #079C48; color: white; padding: 10px; text-align: left; }
                        .product-table td { padding: 8px; border: 1px solid #ddd; }
                        .product-table tr:nth-child(even) { background-color: #f9f9f9; }
                        .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 20px; }
                        .footer { margin-top: 40px; text-align: center; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">Rapport du magasin</div>
                        <div class="subtitle">${store.nomMagasin}</div>
                        <div>Généré le ${new Date().toLocaleDateString(
                          "fr-FR"
                        )}</div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Informations du magasin</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Nom:</div>
                                <div class="info-value">${
                                  store.nomMagasin
                                }</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Localisation:</div>
                                <div class="info-value">${
                                  store.localiteMagasin
                                }</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Contact:</div>
                                <div class="info-value">${
                                  store.contactMagasin || "Non renseigné"
                                }</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Pays:</div>
                                <div class="info-value">${
                                  store.pays || "Non renseigné"
                                }</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Date de création:</div>
                                <div class="info-value">${
                                  store.dateAjout
                                    ? new Date(
                                        store.dateAjout
                                      ).toLocaleDateString("fr-FR")
                                    : "Non renseignée"
                                }</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Nombre de vues:</div>
                                <div class="info-value">${
                                  store.nbreView || 0
                                }</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Produits en stock (${
                          products.length
                        })</div>
                        ${
                          products.length > 0
                            ? `
                            <table class="product-table">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th>Type</th>
                                        <th>Prix (F CFA)</th>
                                        <th>Quantité</th>
                                        <th>Valeur totale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${products
                                      .map(
                                        (product) => `
                                        <tr>
                                            <td>${product.nomProduit}</td>
                                            <td>${
                                              product.typeProduit || "N/A"
                                            }</td>
                                            <td>${product.prix.toLocaleString(
                                              "fr-FR"
                                            )}</td>
                                            <td>${product.quantiteStock}</td>
                                            <td>${(
                                              product.prix *
                                              product.quantiteStock
                                            ).toLocaleString(
                                              "fr-FR"
                                            )} F CFA</td>
                                        </tr>
                                    `
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                            <div class="total">
                                Valeur totale du stock: ${products
                                  .reduce(
                                    (total, p) =>
                                      total + p.prix * p.quantiteStock,
                                    0
                                  )
                                  .toLocaleString("fr-FR")} F CFA
                            </div>
                        `
                            : "<p>Aucun produit en stock</p>"
                        }
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Statistiques</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Nombre total de produits:</div>
                                <div class="info-value">${products.length}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Quantité totale en stock:</div>
                                <div class="info-value">${products.reduce(
                                  (total, p) => total + p.quantiteStock,
                                  0
                                )}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Valeur totale:</div>
                                <div class="info-value">${products
                                  .reduce(
                                    (total, p) =>
                                      total + p.prix * p.quantiteStock,
                                    0
                                  )
                                  .toLocaleString("fr-FR")} F CFA</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Rapport généré automatiquement par Koumi</p>
                        <p>© ${new Date().getFullYear()} Tous droits réservés</p>
                    </div>
                </body>
                </html>
            `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Partager le fichier PDF
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `Rapport ${store.nomMagasin}`,
        UTI: "com.adobe.pdf",
      });

      Alert.alert("Succès", "Rapport PDF généré avec succès");
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      Alert.alert("Erreur", "Impossible de générer le rapport PDF");
    } finally {
      setGenerating(false);
      setGeneratingType(null);
      onClose();
    }
  };

  const generateWordReport = async () => {
    try {
      setGenerating(true);
      setGeneratingType("word");

      const content = `
                RAPPORT DU MAGASIN
                ===================
                
                Magasin: ${store.nomMagasin}
                Généré le: ${new Date().toLocaleDateString("fr-FR")}
                
                INFORMATIONS DU MAGASIN
                -----------------------
                Nom: ${store.nomMagasin}
                Localisation: ${store.localiteMagasin}
                Contact: ${store.contactMagasin || "Non renseigné"}
                Pays: ${store.pays || "Non renseigné"}
                Date de création: ${
                  store.dateAjout
                    ? new Date(store.dateAjout).toLocaleDateString("fr-FR")
                    : "Non renseignée"
                }
                Nombre de vues: ${store.nbreView || 0}
                
                PRODUITS EN STOCK (${products.length})
                -----------------------------------
                ${
                  products.length > 0
                    ? products
                        .map(
                          (product, index) => `
                ${index + 1}. ${product.nomProduit}
                   Type: ${product.typeProduit || "N/A"}
                   Prix: ${product.prix.toLocaleString("fr-FR")} F CFA
                   Quantité: ${product.quantiteStock}
                   Valeur: ${(
                     product.prix * product.quantiteStock
                   ).toLocaleString("fr-FR")} F CFA
                `
                        )
                        .join("\n")
                    : "Aucun produit en stock"
                }
                
                STATISTIQUES
                ------------
                Nombre total de produits: ${products.length}
                Quantité totale en stock: ${products.reduce(
                  (total, p) => total + p.quantiteStock,
                  0
                )}
                Valeur totale du stock: ${products
                  .reduce((total, p) => total + p.prix * p.quantiteStock, 0)
                  .toLocaleString("fr-FR")} F CFA
                
                ---
                Rapport généré automatiquement par Koumi
                © ${new Date().getFullYear()} Tous droits réservés
            `;

      // Utiliser la nouvelle API de expo-file-system
      const cacheDir = new Directory(Paths.cache);
      const fileName = `Rapport_${store.nomMagasin.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.txt`;

      try {
        // Créer le fichier dans le cache
        const file = cacheDir.createFile(fileName, "text/plain");

        // Écrire le contenu dans le fichier
        // Note: La nouvelle API n'a pas encore de méthode writeAsStringAsync directe
        // On va utiliser l'ancienne API pour l'écriture
        await (async () => {
          const { writeAsStringAsync } = require("expo-file-system");
          await writeAsStringAsync(file.uri, content);
        })();

        // Partager le fichier
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/plain",
          dialogTitle: `Rapport ${store.nomMagasin}`,
          UTI: "public.plain-text",
        });

        Alert.alert("Succès", "Rapport Word (TXT) généré avec succès");
      } catch (fileError) {
        console.error("Erreur création fichier:", fileError);

        // Fallback: partager directement le texte
        await Sharing.shareAsync({
          message: content,
          title: `Rapport ${store.nomMagasin}`,
        });

        Alert.alert("Succès", "Rapport partagé avec succès");
      }
    } catch (error: any) {
      console.error("Erreur génération Word:", error);

      // Solution alternative si tout échoue
      try {
        const content = `
                    RAPPORT DU MAGASIN
                    ===================
                    
                    Magasin: ${store.nomMagasin}
                    Généré le: ${new Date().toLocaleDateString("fr-FR")}
                    
                    INFORMATIONS DU MAGASIN
                    -----------------------
                    Nom: ${store.nomMagasin}
                    Localisation: ${store.localiteMagasin}
                    Contact: ${store.contactMagasin || "Non renseigné"}
                    Pays: ${store.pays || "Non renseigné"}
                    Date de création: ${
                      store.dateAjout
                        ? new Date(store.dateAjout).toLocaleDateString("fr-FR")
                        : "Non renseignée"
                    }
                    Nombre de vues: ${store.nbreView || 0}
                    
                    PRODUITS EN STOCK (${products.length})
                    -----------------------------------
                    ${
                      products.length > 0
                        ? products
                            .map(
                              (product, index) => `
                    ${index + 1}. ${product.nomProduit}
                       Type: ${product.typeProduit || "N/A"}
                       Prix: ${product.prix.toLocaleString("fr-FR")} F CFA
                       Quantité: ${product.quantiteStock}
                       Valeur: ${(
                         product.prix * product.quantiteStock
                       ).toLocaleString("fr-FR")} F CFA
                    `
                            )
                            .join("\n")
                        : "Aucun produit en stock"
                    }
                    
                    STATISTIQUES
                    ------------
                    Nombre total de produits: ${products.length}
                    Quantité totale en stock: ${products.reduce(
                      (total, p) => total + p.quantiteStock,
                      0
                    )}
                    Valeur totale du stock: ${products
                      .reduce((total, p) => total + p.prix * p.quantiteStock, 0)
                      .toLocaleString("fr-FR")} F CFA
                    
                    ---
                    Rapport généré automatiquement par Koumi
                    © ${new Date().getFullYear()} Tous droits réservés
                `;

        await Sharing.shareAsync({
          message: content,
          title: `Rapport ${store.nomMagasin}`,
        });

        Alert.alert("Succès", "Rapport partagé avec succès");
      } catch (fallbackError) {
        console.error("Erreur alternative:", fallbackError);
        Alert.alert("Erreur", "Impossible de générer le rapport Word");
      }
    } finally {
      setGenerating(false);
      setGeneratingType(null);
      onClose();
    }
  };

  // Version simplifiée qui évite les problèmes d'API
  const generateWordReportSimple = async () => {
    try {
      setGenerating(true);
      setGeneratingType("word");

      const content = `
                RAPPORT DU MAGASIN
                ===================
                
                Magasin: ${store.nomMagasin}
                Généré le: ${new Date().toLocaleDateString("fr-FR")}
                
                INFORMATIONS DU MAGASIN
                -----------------------
                Nom: ${store.nomMagasin}
                Localisation: ${store.localiteMagasin}
                Contact: ${store.contactMagasin || "Non renseigné"}
                Pays: ${store.pays || "Non renseigné"}
                Date de création: ${
                  store.dateAjout
                    ? new Date(store.dateAjout).toLocaleDateString("fr-FR")
                    : "Non renseignée"
                }
                Nombre de vues: ${store.nbreView || 0}
                
                PRODUITS EN STOCK (${products.length})
                -----------------------------------
                ${
                  products.length > 0
                    ? products
                        .map(
                          (product, index) => `
                ${index + 1}. ${product.nomProduit}
                   Type: ${product.typeProduit || "N/A"}
                   Prix: ${product.prix.toLocaleString("fr-FR")} F CFA
                   Quantité: ${product.quantiteStock}
                   Valeur: ${(
                     product.prix * product.quantiteStock
                   ).toLocaleString("fr-FR")} F CFA
                `
                        )
                        .join("\n")
                    : "Aucun produit en stock"
                }
                
                STATISTIQUES
                ------------
                Nombre total de produits: ${products.length}
                Quantité totale en stock: ${products.reduce(
                  (total, p) => total + p.quantiteStock,
                  0
                )}
                Valeur totale du stock: ${products
                  .reduce((total, p) => total + p.prix * p.quantiteStock, 0)
                  .toLocaleString("fr-FR")} F CFA
                
                ---
                Rapport généré automatiquement par Koumi
                © ${new Date().getFullYear()} Tous droits réservés
            `;

      // Solution la plus simple: partager directement le texte
      await Sharing.shareAsync({
        message: content,
        title: `Rapport ${store.nomMagasin}`,
      });

      Alert.alert("Succès", "Rapport partagé avec succès");
    } catch (error: any) {
      console.error("Erreur génération Word:", error);
      Alert.alert("Erreur", "Impossible de générer le rapport Word");
    } finally {
      setGenerating(false);
      setGeneratingType(null);
      onClose();
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={generatePDFReport}
        disabled={generating}
        className="flex-row items-center py-4 px-4 bg-blue-50 rounded-xl mb-3 border border-blue-200"
      >
        <FileText size={24} color="#3B82F6" className="mr-3" />
        <View className="flex-1">
          <Text className="text-gray-800 font-medium">Générer PDF</Text>
          <Text className="text-gray-500 text-sm">
            Format professionnel avec mise en page
          </Text>
        </View>
        {generating && generatingType === "pdf" ? (
          <Text className="text-blue-600 text-sm">Génération...</Text>
        ) : (
          <Download size={20} color="#3B82F6" />
        )}
      </TouchableOpacity>
      {/* 
      <TouchableOpacity
        onPress={generateWordReportSimple} // Utiliser la version simplifiée
        disabled={generating}
        className="flex-row items-center py-4 px-4 bg-green-50 rounded-xl mb-3 border border-green-200"
      >
        <File size={24} color="#10B981" className="mr-3" />
        <View className="flex-1">
          <Text className="text-gray-800 font-medium">Générer Word</Text>
          <Text className="text-gray-500 text-sm">
            Format texte pour édition
          </Text>
        </View>
        {generating && generatingType === "word" ? (
          <Text className="text-green-600 text-sm">Génération...</Text>
        ) : (
          <Download size={20} color="#10B981" />
        )}
      </TouchableOpacity> */}
    </View>
  );
};

export default ReportGenerator;
