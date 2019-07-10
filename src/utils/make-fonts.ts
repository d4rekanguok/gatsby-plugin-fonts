import execa from 'execa'
import path from 'path'

interface BaseArgs {
  directory: string;
  textPath: string;
}

interface MakeFontsArgs extends BaseArgs {
  fontFile: string;
}

interface MakeAllFontsArgs extends BaseArgs {
  fontFiles: string[];
}

const FLAVORS = ['woff', 'woff2']

export const makeFonts = ({
  directory,
  fontFile,
  textPath,
}: MakeFontsArgs) => {
  const { name: fontName, dir: fontDir } = path.parse(fontFile)

  console.log(fontName, fontDir)

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

export const makeAllFonts = async ({
  directory,
  fontFiles,
  textPath,
}: MakeAllFontsArgs) => {
  return Promise.all(fontFiles.map(fontFile => makeFonts({ directory, fontFile, textPath })))
}