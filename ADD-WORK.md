# Add a project to your portfolio

Your public site: https://anuraghbaddur37.github.io/

## Upload a video or screenshot (no coding)

1. Sign in to GitHub and open `anuraghbaddur37/anuraghbaddur37.github.io`.
2. Open the **work** folder. Choose **Add file → Upload files**.
3. Drag in your MP4 video or PNG/JPG/WebP screenshot. For browser uploads, keep each file below 25 MiB. MP4 with H.264 video and AAC audio is recommended.
4. Give the file a useful name before uploading, for example `VISI-Mould-Design.mp4` or `ESPRIT-5-Axis-Finishing.png`. The name becomes its project title automatically. Each media file creates one card.
5. Click **Commit changes**, selecting the `main` branch.
6. Wait for **Actions → pages build and deployment** to finish successfully, then open your portfolio. Publishing is not instantaneous; allow a few minutes. The open gallery checks for published updates every minute, except while a project is playing.

Only files in this repository's **work/** folder (including its subfolders) enter the gallery. Uploading files to other repositories or the repository root does not add them. Supported formats: MP4, WebM, PNG, JPG, JPEG, WebP and GIF. Screenshots open large; videos open in a player with playback and fullscreen controls.

## Optional: add a description, thumbnail and workflow steps

Edit `projects.json` at the repository root. It maps each exact file path to its description. Follow the existing examples. A new item can look like this (add a comma between entries; do not add a comma after the last one):

```json
"/work/VISI-Mould-Design.mp4": {
  "title": "Mould design in VISI",
  "category": "VISI / TOOL DESIGN",
  "description": "A walkthrough of my mould design workflow.",
  "poster": "posters/visi-mould-design.jpg",
  "steps": ["Prepare the part", "Create core and cavity", "Review the tool"]
}
```

Upload the optional thumbnail to **posters/**, not **work/**, to avoid making it a separate project. The `poster` and `steps` fields can be omitted. Metadata is optional; uploading media alone is enough. Unlisted new media appears before the two curated demonstration cards.

## Replace your résumé

At the repository root choose **Add file → Upload files**, upload the updated PDF named exactly `Anurag_Baddur_Resume.pdf`, then commit. The résumé download buttons will use the replacement after Pages publishes it.

## How automatic updates work

GitHub Pages builds `gallery.json` from every supported media file in `work/`, using Jekyll's static-file list. No private token or separate service is needed. Keep `gallery.json` and `_config.yml`; do not add a `.nojekyll` file, which would disable gallery generation. File names, descriptions and code are public in this repository. Upload only work you are allowed to share.

If an upload does not appear: check its folder and extension, confirm the Pages build is green in Actions, and refresh the site. Large videos should be compressed before browser upload. To remove a card, delete its media file from `work/` and commit; optionally remove its entry from `projects.json`.
