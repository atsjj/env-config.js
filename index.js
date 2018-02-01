"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvConfig {
    constructor(namespace, target) {
        this.namespace = [];
        this._target = null;
        if (namespace) {
            this.namespace = namespace.split('.');
        }
        if (target) {
            this._target = target.toLowerCase();
        }
    }
    get target() {
        if (this._target) {
            return this._target;
        }
        else {
            return this.has('NODE_ENV') ? this.value('NODE_ENV') : 'development';
        }
    }
    value(key) {
        return process.env[key];
    }
    keys(key) {
        return key.split('.');
    }
    has(key) {
        return Reflect.has(process.env, key);
    }
    lookup(key) {
        const keys = this.keys(key);
        const withNamespaceTarget = [...this.namespace, this.target, ...keys]
            .join('_').toUpperCase();
        const withNamespace = [...this.namespace, ...keys]
            .join('_').toUpperCase();
        const withoutNamespace = keys.join('_').toUpperCase();
        return [withNamespaceTarget, withNamespace, withoutNamespace];
    }
    required(key) {
        const keys = this.lookup(key);
        const envKey = keys.find(k => this.has(k));
        if (envKey) {
            return this.value(envKey);
        }
        else {
            throw `${keys.join(' or ')} must be provided.`;
        }
    }
    optional(key) {
        try {
            return this.required(key);
        }
        catch (_) {
            return null;
        }
    }
}
exports.EnvConfig = EnvConfig;
function default_1(namespace) {
    return new EnvConfig(namespace);
}
exports.default = default_1;
