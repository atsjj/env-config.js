export class EnvConfig {
  namespace: string[] = [];
  _target: string = null;

  constructor(namespace?: string, target?: string) {
    if (namespace) {
      this.namespace = namespace.split('.');
    }

    if (target) {
      this._target = target.toLowerCase();
    }
  }

  get target(): string {
    if (this._target) {
      return this._target;
    } else {
      return this.has('NODE_ENV') ? this.value('NODE_ENV') : 'development';
    }
  }

  value(key): string {
    return process.env[key];
  }

  keys(key: string): string[] {
    return key.split('.');
  }

  has(key): boolean {
    return Reflect.has(process.env, key);
  }

  lookup(key: string): string[] {
    const keys: string[] = this.keys(key);
    
    const withNamespaceTarget: string = [...this.namespace, this.target, ...keys]
      .join('_').toUpperCase();

    const withNamespace: string = [...this.namespace, ...keys]
      .join('_').toUpperCase();
    
    const withoutNamespace: string = keys.join('_').toUpperCase();

    return [withNamespaceTarget, withNamespace, withoutNamespace];
  }

  required(key: string): string {
    const keys: string[] = this.lookup(key);
    const envKey: string = keys.find(k => this.has(k));

    if (envKey) {
      return this.value(envKey);
    } else {
      throw `${keys.join(' or ')} must be provided.`;
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
