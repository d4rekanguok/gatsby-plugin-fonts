import fs from 'fs-extra'
import path from 'path'
import { GatsbyNode, PluginOptions } from 'gatsby'
import { consolidate } from './utils/consolidate'
import { makeAllFonts } from './utils/make-fonts'

interface FontOptions extends PluginOptions {
  files: string;
  fontFiles: string[];
}

export const onPostBuild: GatsbyNode['onPostBuild'] = async ({ store }, options: FontOptions) => {
  const { files, fontFiles } = options

  const { directory } = store.getState().program
  const contentText = await consolidate({
    root: directory,
    files,
  })

  const purged = contentText.replace(/[\x00-\x7F]+/g, '')

  const textPath = path.join(directory, './.cache', 'all-content-text.txt')
  await fs.ensureFile(textPath)
  await fs.writeFile(textPath, purged)

  await makeAllFonts({
    directory,
    fontFiles,
    textPath,
  })
}