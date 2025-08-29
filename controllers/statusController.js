import Status from "../models/status.js";

// 📌 Créer un nouveau status
export const createStatus = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Le titre est requis" });
    if (!req.file) return res.status(400).json({ message: "Fichier requis" });

    // Domaine fixe (ou récupéré depuis .env)
    const baseUrl = process.env.BASE_URL || "https://huit.onrender.com";

    // URL complète du fichier (image ou vidéo)
    const fileUrl = `${baseUrl}/uploadsstatus/${req.file.filename}`;
    const type = req.file.mimetype.startsWith("image/") ? "image" : "video";

    const status = new Status({ title, image: fileUrl, type });
    await status.save();

    res.status(201).json({ message: "Status créé avec succès ✅", status });
  } catch (error) {
    console.error("Erreur création status:", error);
    res.status(500).json({ message: "Erreur lors de la création du status", error });
  }
};

// 📌 Récupérer tous les status
export const getAllStatus = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 });
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statuts", error });
  }
};

// 📌 Récupérer un status par ID
export const getStatusById = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ message: "Status non trouvé" });
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du status", error });
  }
};

// 📌 Mettre à jour un status
export const updateStatus = async (req, res) => {
  try {
    const { title } = req.body;
    const baseUrl = process.env.BASE_URL || "https://huit.onrender.com";

    let updateData = { title };

    if (req.file) {
      updateData.image = `${baseUrl}/uploadsstatus/${req.file.filename}`;
    }

    const status = await Status.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!status) return res.status(404).json({ message: "Status non trouvé" });

    res.status(200).json({ message: "Status mis à jour ✅", status });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
};

// 📌 Supprimer un status
export const deleteStatus = async (req, res) => {
  try {
    const status = await Status.findByIdAndDelete(req.params.id);
    if (!status) return res.status(404).json({ message: "Status non trouvé" });

    res.status(200).json({ message: "Status supprimé ✅" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
