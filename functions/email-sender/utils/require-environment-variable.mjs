export function requireEnvironmentVariable(name, environment) {
    const value = environment[name]?.trim();
  
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  
    return value;
}