
export interface AuthConfiguration {
  jwt: {
    secret: string,
    signOptions: {
      expiresIn: number|string,
    }
  };
  [key: string]: any;
}

export interface ExplorerConfiguration {
  root: string;
  [key: string]: any;
}

export interface Configuration {
  auth: AuthConfiguration;
  explorer: ExplorerConfiguration;
  [key: string]: any;
}
