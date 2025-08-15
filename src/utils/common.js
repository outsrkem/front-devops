export function toLoginPage() {
    let url = `/authui/login.html?returnto=${encodeURIComponent(window.location.href)}`;
    return (window.location.href = url);
}

export function toUserCenter() {
    let url = `/console/#/accountInfo`;
    return window.open(url, "_blank");
}

export function toConsole() {
    let url = `/console`;
    return window.open(url, "_blank");
}

export function saveNavPath(activePath) {
    window.sessionStorage.setItem("active-path", activePath);
}

export function convertToLimitOffset(page, pageSize) {
    // Convert parameters to numbers if they are strings
    const pageNum = Number(page);
    const size = Number(pageSize);

    // Validate parameters
    if (isNaN(pageNum) || isNaN(size)) {
        throw new Error("Page and pageSize must be numbers");
    }
    if (pageNum < 1) {
        throw new Error("Page must be at least 1");
    }
    if (size < 1) {
        throw new Error("PageSize must be at least 1");
    }

    // Calculate limit and offset
    const limit = Math.floor(size);
    const offset = Math.floor((pageNum - 1) * size);

    return { offset, limit };
}
