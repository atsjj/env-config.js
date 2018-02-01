"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvConfig {
    constructor(namespace) {
        this.namespace = [];
        this.namespace = namespace.split('.');
    }
    keys(key) {
        return key.split('.');
    }
    required(key) {
        const keys = this.keys(key);
        const withNamespace = [...this.namespace, ...keys].join('_').toUpperCase();
        const withoutNamespace = keys.join('_').toUpperCase();
        if (Reflect.has(process.env, withNamespace)) {
            return process.env[withNamespace];
        }
        else if (Reflect.has(process.env, withoutNamespace)) {
            return process.env[withoutNamespace];
        }
        else {
            throw `${withNamespace} or ${withoutNamespace} must be provided.`;
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
