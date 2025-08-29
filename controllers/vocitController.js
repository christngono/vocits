// controllers/vocitsController.js
import Vocit from '../models/vocit.js';


// 📌 Créer un nouveau vocit
export const createVocit = async (req, res) => {
  try {
    const { title, content, categorie, tags } = req.body;

    // Domaine fixe (ou via .env pour être plus flexible)
    const baseUrl = process.env.BASE_URL || 'https://huit.onrender.com';

    // 📌 Le chemin public de l'image
    let imagePath = null;
    if (req.file) {
      imagePath = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const newVocit = new Vocit({
      image: imagePath, // ou media si tu préfères
      title,
      content,
      categorie,
      tags
    });

    await newVocit.save();
    res.status(201).json(newVocit);
  } catch (error) {
    console.error("Erreur création vocit:", error);
    res.status(500).json({ message: 'Erreur lors de la création du vocit', error });
  }
};



// 📌 Récupérer tous les vocits et tous les stats
// 📌 Récupérer tous les vocits avec leurs statistiques
export const getAllVocits = async (req, res) => {
  try {
    const vocits = await Vocit.find().sort({ createdAt: -1 });

    // Transformer chaque vocit avec ses stats
    const vocitsWithStats = vocits.map((vocit) => {
      const totalVotes = vocit.votePour + vocit.voteContre + vocit.voteAbstention;

      const percent = (count) =>
        totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(2) : 0;

      return {
        ...vocit._doc, // 📌 inclure toutes les données du vocit
        stats: {
          totalVotes,
          pour: {
            count: vocit.votePour,
            percentage: percent(vocit.votePour),
          },
          contre: {
            count: vocit.voteContre,
            percentage: percent(vocit.voteContre),
          },
          abstention: {
            count: vocit.voteAbstention,
            percentage: percent(vocit.voteAbstention),
          },
        },
      };
    });

    res.status(200).json(vocitsWithStats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des vocits", error });
  }
};


// 📌 Récupérer un vocit par ID
export const getVocitById = async (req, res) => {
  try {
    const vocit = await Vocit.findById(req.params.id);
    if (!vocit) return res.status(404).json({ message: 'Vocit introuvable' });
    res.status(200).json(vocit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du vocit', error });
  }
};

// 📌 Mettre à jour un vocit
export const updateVocit = async (req, res) => {
  try {
    const vocit = await Vocit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vocit) return res.status(404).json({ message: 'Vocit introuvable' });
    res.status(200).json(vocit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
  }
};

// 📌 Supprimer un vocit
export const deleteVocit = async (req, res) => {
  try {
    const vocit = await Vocit.findByIdAndDelete(req.params.id);
    if (!vocit) return res.status(404).json({ message: 'Vocit introuvable' });
    res.status(200).json({ message: 'Vocit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
};

// 📌 Voter pour un vocit
export const voteVocit = async (req, res) => {
  try {
    const { choice } = req.body; // 'pour', 'contre', 'abstention'
    const userId = req.user.id; // 📌 Nécessite un middleware JWT pour remplir req.user

    if (!['pour', 'contre', 'abstention'].includes(choice)) {
      return res.status(400).json({ message: 'Choix de vote invalide' });
    }

    const vocit = await Vocit.findById(req.params.id);
    if (!vocit) return res.status(404).json({ message: 'Vocit introuvable' });

    // 📌 Vérifier si l'utilisateur a déjà voté
    const existingVote = vocit.votes.find(v => v.user.toString() === userId);

    if (existingVote) {
      // ✅ Ajuster le compteur en retirant son ancien vote
      if (existingVote.choice === 'pour') vocit.votePour--;
      if (existingVote.choice === 'contre') vocit.voteContre--;
      if (existingVote.choice === 'abstention') vocit.voteAbstention--;

      // ✅ Mettre à jour le vote
      existingVote.choice = choice;
    } else {
      // ✅ Ajouter un nouveau vote
      vocit.votes.push({ user: userId, choice });
    }

    // 📌 Incrémenter le bon compteur
    if (choice === 'pour') vocit.votePour++;
    if (choice === 'contre') vocit.voteContre++;
    if (choice === 'abstention') vocit.voteAbstention++;

    await vocit.save();
    res.status(200).json(vocit);

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du vote', error });
  }
};
// 📌 Rechercher vocits
export const searchVocits = async (req, res) => {
  try {
    const { q, categorie, tag } = req.query;
    const filters = {};

    if (q) filters.title = { $regex: q, $options: 'i' };
    if (categorie) filters.categorie = categorie;
    if (tag) filters.tags = tag;

    const vocits = await Vocit.find(filters).sort({ createdAt: -1 });
    res.status(200).json(vocits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche', error });
  }
};





