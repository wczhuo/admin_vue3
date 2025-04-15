export const getSiteInfo = () => {
    let siteInfo = localStorage.getItem('siteInfo');
    return siteInfo ? JSON.parse(siteInfo) : null;
}

export const setSiteInfo = (info: object) => {
    return localStorage.setItem('siteInfo', JSON.stringify(info))
}
