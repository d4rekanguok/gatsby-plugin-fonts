import execa from 'execa'
import path from 'path'

interface MakeFontsArg {
  directory: string;
  fontFile: string;
  textPath: string;
}

const FLAVORS = ['woff', 'woff2']

export const makeFonts = ({
  directory,
  fontFile,
  textPath,
}: MakeFontsArg) => {
  const { name: fontName, dir: fontDir } = path.parse(fontFile)
  const fontPath = path.resolve(directory, fontFile)
  return Promise.all(FLAVORS.map(ext => {
    const subsetFile = path.resolve(directory, fontDir, `${fontName}__subset.${ext}`)
    return execa('pyftsubset', [
      fontPath,
      `--text-file=${textPath}`,
      `--flavor=${ext}`,
      `--output-file=${subsetFile}`,
      '--ignore-missing-glyphs'
    ]) 
  }))
}