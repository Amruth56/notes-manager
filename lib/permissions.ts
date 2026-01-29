export const canUpload = (role: string) => {
    if(role === "professor" || role === "cr") return true;
    return false;
}