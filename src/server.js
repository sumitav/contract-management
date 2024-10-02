import { PORT } from './configs/environment/environment.config.js';
import app from './app.js';

app.listen(PORT, () => console.log(`Your wonderful server is running in port: ${PORT} !!!`));