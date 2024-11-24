# Sound-Git

[Demo](https://page.peacht.art/soundgit/) (I’m currently using it!)

Sound-Git is a static player that helps you host and play MP3 files using GitHub Pages.

## Key Features

| Feature | Sound-Git | SoundCloud (Free) |
|---|---|---|
| Audio upload | O (via Git) | O |
| Personalized page | O | O |
| Individual audio page | O | O |
| Audio length | Unlimited | 3 hours |
| Playlist | X | O |
| Audio loop | O | O |
| Background playback | O | O |
| Audio replacement | O | X |
| Additional info input | O | O |
| Comments | X | O |
| Open Graph preview | X | O |

## How to Use

The basic usage is as follows. This assumes you are familiar with Git.

1. Sign up for GitHub.  
2. Fork [this repository](https://github.com/jyhyun1008/soundgit).  
3. Delete the contents of the `mp3`, `img`, and `info` folders and replace them with your files.  
4. Edit the `/README.md` file, for example, to include your introduction, and you can use it as a portfolio.  

## Upload Instructions

Upload files with the same filename but different extensions in the `mp3`, `img`, and `info` folders.

Don’t forget to include the date. If not, you can still make it work by using `unknown` before the underscore.

```
date_song-title.mp3  
date_song-title.png  
date_song-title.md  
```

- `mp3`: The `.mp3` file you want to host.  
- `img`: The `.png` file for the cover image. While non-square images will be cropped, square images are recommended. Please convert `.jpg` files to `.png`.  
- `md`: A Markdown file (`.md`) containing audio information and lyrics. Since there’s no UI section to display song titles, it’s recommended to specify them in this file.  

Even if you only upload the `mp3` file without `img` or `info`, it will still work.

## Notes

- As this is a project under Peachtart, the default images and icons are set to the Peachtart default icons. Please replace them yourself.  
- Do not upload audio files that you didn’t create or don’t own the rights to!  
- Due to the nature of GitHub, uploaded audio files can be downloaded by anyone.