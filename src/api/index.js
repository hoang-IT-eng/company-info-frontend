import axiosInstance from './axios';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.data?.LtsItem)) return payload.data.LtsItem;
  if (Array.isArray(payload?.LtsItem)) return payload.LtsItem;
  return [];
};

const normalizeOption = (item) => {
  if (!item || typeof item !== 'object') return null;
  const id =
    item.id ??
    item.ID ??
    item.code ??
    item.Code ??
    item.value ??
    item.Value ??
    item.SolrID ??
    item.SolrId ??
    item.slug ??
    item.Slug ??
    item.Title;

  const name =
    item.name ??
    item.Name ??
    item.Title ??
    item.label ??
    item.Label ??
    item.Text;

  if (id == null && name == null) return null;
  return { id: String(id ?? name), name: String(name ?? id) };
};

const normalizeCompany = (item) => {
  if (!item || typeof item !== 'object') return null;

  const mst =
    item.mst ??
    item.MaSoThue ??
    item.MST ??
    item.taxCode ??
    item.TaxCode ??
    item.Taxcode ??
    item.MaSoHienThoi ??
    item.Id ??
    item.ID;

  const name =
    item.name ??
    item.Title ??
    item.TenCongTy ??
    item.TenDoanhNghiep ??
    item.CompanyName ??
    item.Ten;

  const address = item.address ?? item.DiaChiCongTy ?? item.DiaChi ?? item.Address;

  const industry =
    item.industry ??
    item.NganhNgheTitle ??
    item.NganhNghe ??
    item.Industry ??
    item.NganhNgheChinh ??
    item.NganhNgheKinhDoanh;

  const representative =
    item.representative ??
    item.NguoiDaiDien ??
    item.ChuSoHuu ??
    item.GiamDoc ??
    item.DaiDienPhapLuat;

  const issueDate = item.issueDate ?? item.NgayCap ?? item.NgayBatDauHopDong;

  return {
    id: item.id ?? item.ID ?? item.Id ?? mst,
    mst: mst ? String(mst) : undefined,
    name,
    address,
    industry,
    industryName: item.industryName ?? item.NganhNgheTitle ?? industry,
    representative,
    phone: item.phone ?? item.DienThoai ?? item.Phone,
    email: item.email ?? item.Email,
    issueDate,
    status: item.status ?? item.TrangThai ?? item.Status,
  };
};

const normalizeCompanies = (items) => items.map(normalizeCompany).filter(Boolean);

export const getCities = async () => {
  try {
    const response = await axiosInstance.get('/api/city');
    const list = normalizeList(response.data);
    const mapped = list.map(normalizeOption).filter(Boolean);
    return mapped.length > 0 ? mapped : list;
  } catch (error) {
    return [
      { id: '01', name: 'Hà Nội' },
      { id: '79', name: 'Hồ Chí Minh' },
      { id: '48', name: 'Đà Nẵng' },
    ];
  }
};

export const getIndustries = async () => {
  try {
    const response = await axiosInstance.get('/api/industry');
    const list = normalizeList(response.data);
    const mapped = list.map(normalizeOption).filter(Boolean);
    return mapped.length > 0 ? mapped : list;
  } catch (error) {
    return [
      { id: '1', name: 'Công nghệ thông tin' },
      { id: '2', name: 'Tài chính - Ngân hàng' },
      { id: '3', name: 'Bất động sản' },
    ];
  }
};

export const searchCompanies = async (params) => {
  const response = await axiosInstance.get('/api/company/search', { params });
  const payload = response.data;
  let list = normalizeList(payload?.data ?? payload);

  if (!Array.isArray(list) && payload?.data && typeof payload.data === 'object') {
    list = [payload.data];
  }

  const total =
    payload?.total ??
    payload?.totalItems ??
    payload?.data?.total ??
    payload?.data?.totalItems ??
    payload?.data?.Total ??
    payload?.data?.TotalDoanhNghiep ??
    payload?.TotalDoanhNghiep ??
    (Array.isArray(list) ? list.length : 0);

  if (Array.isArray(list)) {
    return { ...payload, data: normalizeCompanies(list), total };
  }

  return payload;
};

export const getCompanyDetail = async (mst) => {
  const response = await axiosInstance.get(`/api/company/${mst}`);
  const payload = response.data?.data ?? response.data;

  if (payload?.LtsItem && Array.isArray(payload.LtsItem) && payload.LtsItem[0]) {
    return normalizeCompany(payload.LtsItem[0]);
  }

  return normalizeCompany(payload) ?? payload;
};
