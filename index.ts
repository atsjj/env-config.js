export class EnvConfig {
  namespace: string[] = [];

  constructor(namespace: string) {
    this.namespace = namespace.split('.');
  }

  keys(key: string): string[] {
    return key.split('.');
  }

  required(key: string): string {
    const keys: string[] = this.keys(key);
    const withNamespace: string = [...this.namespace, ...keys].join('_').toUpperCase();
    const withoutNamespace: string = keys.join('_').toUpperCase();

    if (Reflect.has(process.env, withNamespace)) {
      return process.env[withNamespace];
    } else if(Reflect.has(process.env, withoutNamespace)) {
      return process.env[withoutNamespace];
    } else {
      throw `${withNamespace} or ${withoutNamespace} must be provided.`;
    }
  }

  optional(key: string): string {
    try {
      return this.required(key);
    } catch(_) {
      return null;
    }
  }
}

export default function(namespace: string) {
  return new EnvConfig(namespace);
}
