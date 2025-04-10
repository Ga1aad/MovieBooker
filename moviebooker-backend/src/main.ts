// Configuration CORS
app.enableCors({
  origin: ["http://localhost:5173", "https://moviebooker-gf.netlify.app"], // URLs autorisées
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
