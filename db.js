require("dotenv").config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ MONGODB_URI não encontrada no arquivo .env");
  process.exit(1);
}

// Configurações otimizadas para MongoDB Atlas
const connectionOptions = {
  serverSelectionTimeoutMS: 8000, // 8 segundos (reduzido para falhar mais rápido)
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: "majority",
  tls: true,
  tlsInsecure: false,
  directConnection: false,
};

console.log("🔗 Tentando conectar ao MongoDB Atlas...");
console.log("📍 URI:", mongoUri.replace(/\/\/.*:.*@/, "//***:***@"));
console.log("🌐 Seu IP: 168.181.48.74 (deve estar na whitelist do Atlas)");

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoUri, connectionOptions);
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Falha na conexão com MongoDB Atlas:", error.message);

    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Tentando fallback para MongoDB local...");
      try {
        await mongoose.connect("mongodb://localhost:27017/ellp", {
          serverSelectionTimeoutMS: 3000,
          socketTimeoutMS: 45000,
        });
        console.log("✅ Conectado ao MongoDB local (fallback)");
        console.log(
          "⚠️  AVISO: Para produção, configure o MongoDB Atlas corretamente!"
        );
        return true;
      } catch (localError) {
        console.error("❌ Falha total - nem Atlas nem local funcionaram");
        console.log("💡 Para corrigir:");
        console.log("   1. Adicione o IP 168.181.48.74 na whitelist do Atlas");
        console.log(
          "   2. Ou inicie MongoDB local: brew services start mongodb-community"
        );
        console.log("   3. Ou configure Atlas corretamente");
        throw localError;
      }
    } else {
      throw error;
    }
  }
}

// Tentar conectar
connectToDatabase().catch((error) => {
  console.error("💀 Não foi possível conectar a nenhum banco de dados");
  process.exit(1);
});

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("❌ Erro na conexão com MongoDB:", error.message);
  console.log("💡 Verifique se:");
  console.log("   1. Suas credenciais estão corretas no .env");
  console.log("   2. Seu IP está na whitelist do MongoDB Atlas");
  console.log("   3. O cluster está ativo e acessível");
});

db.once("open", () => {
  console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  console.log(`🗄️  Database: ${db.name}`);
  console.log(`🌐 Host: ${db.host}`);
});

db.on("disconnected", () => {
  console.log("⚠️ MongoDB Atlas desconectado");
});

db.on("reconnected", () => {
  console.log("🔄 Reconectado ao MongoDB Atlas");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔴 Encerrando aplicação...");
  await mongoose.connection.close();
  console.log("✅ Conexão com MongoDB fechada");
  process.exit(0);
});

module.exports = mongoose;
