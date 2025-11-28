export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
};
  
const FIRESTORE_PERMISSION_ERROR_PREFIX = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:`;
  
export class FirestorePermissionError extends Error {
    public readonly name = 'FirestorePermissionError';
    public readonly context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `${FIRESTORE_PERMISSION_ERROR_PREFIX}\n${JSON.stringify(context, null, 2)}`;
        super(message);
        this.context = context;
        Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    }
}
  
export function isFirestorePermissionError(e: any): e is FirestorePermissionError {
    return e instanceof Error && e.message.startsWith(FIRESTORE_PERMISSION_ERROR_PREFIX);
}
  
