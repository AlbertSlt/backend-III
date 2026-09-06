// Helper compartido para paginar listados (usuarios, productos, pedidos, entregas).

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(query = {}) {
    const { page, limit, ...filters } = query;

    let parsedPage = parseInt(page, 10);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        parsedPage = DEFAULT_PAGE;
    }

    let parsedLimit = parseInt(limit, 10);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
        parsedLimit = DEFAULT_LIMIT;
    }
    if (parsedLimit > MAX_LIMIT) {
        parsedLimit = MAX_LIMIT;
    }

    return { page: parsedPage, limit: parsedLimit, filters };
}

export function buildPaginationMeta({ page, limit, total }) {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
    };
}