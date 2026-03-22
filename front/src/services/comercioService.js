const BASE_URL = "https://proyecto-sping-production.up.railway.app/api/comercios";

export const getAll = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

export const create = async (comercio) => {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comercio),
    });
    return res.json();
};

export const update = async (id, comercio) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comercio),
    });
    return res.json();
};

export const remove = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};

export const uploadExcel = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
    });
    return res.json();
};