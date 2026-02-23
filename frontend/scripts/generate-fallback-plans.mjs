import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const fallbackRoot = path.join(rootDir, 'src', 'assets', 'fallback');
const outputFile = path.join(rootDir, 'src', 'data', 'fallbackPlans.ts');

const folderOverrides = {
  'bologo2_13 - Photo': {
    details: [
      '2 bed',
      '2 bath',
      'Kitchen',
      'Lounge',
      'Dining',
      'Single garage',
      '17x16m',
      '169m²',
      'R2100',
    ],
  },
  'kutu_10 - Photo': {
    details: [
      '3 bed',
      '1 bath',
      'Kitchen',
      'Lounge',
      '12x14m',
      'R1799',
    ],
  },
  'GIFT M_10 - Photo': {
    details: [
      '1 bed',
      '1 bath',
      'Kitchen',
      'Lounge',
      'Garage',
      '12x13m',
      'R1400',
    ],
  },
};

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const titleCase = (value) =>
  value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });

const readDetailsLines = (folderName) => {
  const detailsPath = path.join(fallbackRoot, folderName, 'details.txt');
  const override = folderOverrides[folderName]?.details;

  if (override && override.length > 0) {
    return override;
  }

  if (!fs.existsSync(detailsPath)) {
    return [];
  }

  const content = fs.readFileSync(detailsPath, 'utf-8');
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const parsePlanFromDetails = (detailsLines) => {
  const joined = detailsLines.join(' ');

  const bedMatch = joined.match(/(\d+)\s*x?\s*bed/i);
  const bathMatch = joined.match(/(\d+)\s*x?\s*bath/i);
  const priceMatch = joined.match(/R\s*(\d+(?:[.,]\d+)?)/i);
  const areaMatch = joined.match(/(\d+(?:[.,]\d+)?)\s*m²/i);
  const dimensionsMatch = joined.match(/(\d+(?:[.,]\d+)?)\s*m?\s*x\s*(\d+(?:[.,]\d+)?)\s*m/i);

  const bedrooms = parseNumber(bedMatch?.[1] ?? 0);
  const bathrooms = parseNumber(bathMatch?.[1] ?? 0);
  const price = parseNumber((priceMatch?.[1] ?? '0').replace(',', '.'));
  const floorArea = parseNumber((areaMatch?.[1] ?? '0').replace(',', '.'));
  const width = parseNumber((dimensionsMatch?.[1] ?? '0').replace(',', '.'));
  const depth = parseNumber((dimensionsMatch?.[2] ?? '0').replace(',', '.'));

  const features = detailsLines.filter((line) => {
    const lower = line.toLowerCase();
    if (/^r\s*\d/.test(lower)) return false;
    if (/m²/.test(lower)) return false;
    if (/\d+\s*m?\s*x\s*\d+\s*m/.test(lower)) return false;
    if (/^\d+\s*x?\s*bed/.test(lower)) return false;
    if (/^\d+\s*x?\s*bath/.test(lower)) return false;
    return true;
  });

  const levels = features.some((feature) => /double\s*storey/i.test(feature)) ? 2 : 1;
  const garage = features.some((feature) => /double\s*garage/i.test(feature))
    ? 2
    : features.some((feature) => /garage/i.test(feature))
      ? 1
      : 0;

  const lounges = features.some((feature) => /lounge/i.test(feature)) ? 1 : 0;
  const diningAreas = features.some((feature) => /dining/i.test(feature)) ? 1 : 0;

  const style = features.some((feature) => /round/i.test(feature))
    ? 'Round Plan'
    : levels > 1
      ? 'Double Storey'
      : 'Modern';

  const titleParts = [];
  if (bedrooms > 0) {
    titleParts.push(`${bedrooms} Bedroom`);
  } else if (features.some((feature) => /1\s*room/i.test(feature))) {
    titleParts.push('1 Room');
  } else {
    titleParts.push('House');
  }
  if (bathrooms > 0) {
    titleParts.push(`${bathrooms} Bathroom`);
  }
  if (features.some((feature) => /double\s*storey/i.test(feature))) {
    titleParts.push('Double Storey');
  }
  if (features.some((feature) => /double\s*garage/i.test(feature))) {
    titleParts.push('Double Garage');
  }
  titleParts.push('House Plan');

  const normalizedFeatures = features.map((line) => titleCase(line.replace(/^\d+\s*x?\s*/i, '')));

  const descriptionBits = [];
  if (bedrooms > 0) {
    descriptionBits.push(`${bedrooms} bedroom`);
  }
  if (bathrooms > 0) {
    descriptionBits.push(`${bathrooms} bathroom`);
  }

  return {
    title: titleParts.join(' '),
    bedrooms,
    bathrooms,
    price,
    floorArea,
    width,
    depth,
    levels,
    garage,
    lounges,
    diningAreas,
    style,
    features: normalizedFeatures,
    description:
      descriptionBits.length > 0
        ? `${descriptionBits.join(', ')} house plan with ${normalizedFeatures.slice(0, 4).join(', ').toLowerCase() || 'functional layout'}.`
        : `House plan with ${normalizedFeatures.slice(0, 4).join(', ').toLowerCase() || 'functional layout'}.`,
  };
};

const toVarName = (folderName) =>
  folderName
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part, idx) => {
      const clean = part.toLowerCase();
      if (idx === 0) return clean;
      return clean[0].toUpperCase() + clean.slice(1);
    })
    .join('');

const buildPlans = () => {
  const folders = fs
    .readdirSync(fallbackRoot, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort(naturalSort);

  const imports = [];
  const plans = [];

  folders.forEach((folderName, idx) => {
    const folderPath = path.join(fallbackRoot, folderName);
    const imageFiles = fs
      .readdirSync(folderPath)
      .filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name))
      .sort(naturalSort);

    if (imageFiles.length === 0) {
      return;
    }

    const aliasBase = toVarName(folderName);
    const imageVars = imageFiles.slice(0, 3).map((fileName, imageIndex) => {
      const variableName = `${aliasBase}Img${imageIndex + 1}`;
      const importPath = `@/assets/fallback/${folderName}/${fileName}`.replace(/\\/g, '/');
      imports.push(`import ${variableName} from '${importPath}';`);
      return variableName;
    });

    const detailsLines = readDetailsLines(folderName);
    const parsed = parsePlanFromDetails(detailsLines);

    plans.push({
      id: String(54 + idx),
      ...parsed,
      images: imageVars,
      isNew: idx === 0,
      isPopular: idx < 6,
      videoUrl: '',
      enSuite: parsed.bathrooms > 1 ? 1 : 0,
      garageParking: parsed.garage,
      coveredParking: 0,
      petFriendly: true,
      amenities: parsed.features,
    });
  });

  return { imports, plans };
};

const serializePlansFile = ({ imports, plans }) => {
  const planBlocks = plans
    .map((plan) => `  {\n    id: '${plan.id}',\n    title: '${plan.title.replace(/'/g, "\\'")}',\n    price: ${plan.price},\n    bedrooms: ${plan.bedrooms},\n    bathrooms: ${plan.bathrooms},\n    garage: ${plan.garage},\n    floorArea: ${plan.floorArea},\n    levels: ${plan.levels},\n    width: ${plan.width},\n    depth: ${plan.depth},\n    style: ['${plan.style}'],\n    isNew: ${plan.isNew},\n    isPopular: ${plan.isPopular},\n    images: [${plan.images.join(', ')}],\n    description: '${plan.description.replace(/'/g, "\\'")}',\n    features: [${plan.features.map((feature) => `'${feature.replace(/'/g, "\\'")}'`).join(', ')}],\n    videoUrl: '',\n    enSuite: ${plan.enSuite},\n    lounges: ${plan.lounges},\n    diningAreas: ${plan.diningAreas},\n    garageParking: ${plan.garageParking},\n    coveredParking: ${plan.coveredParking},\n    petFriendly: ${plan.petFriendly},\n    amenities: [${plan.amenities.map((feature) => `'${feature.replace(/'/g, "\\'")}'`).join(', ')}],\n  }`)
    .join(',\n');

  return `${imports.join('\n')}\n\nexport const fallbackPlans = [\n${planBlocks}\n];\n`;
};

const { imports, plans } = buildPlans();
const content = serializePlansFile({ imports, plans });
fs.writeFileSync(outputFile, content, 'utf-8');

console.log(`Generated ${plans.length} fallback plans from ${path.relative(rootDir, fallbackRoot)}.`);
