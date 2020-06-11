# YouTube-Replay-Count (YTRC)
Implements a counter which tracks the number of re-watches on YouTube videos. Runs with Tampermonkey (or equivalent).

Saves all data in cookies on the youtube.com/embed/{vidID}/ pages for videos (so don't delete www.youtube.com cookies to maintain counter).

By default, the counter triggers upon cumulatively watching 75% of a video. This can be canged manually (maybe UI coming later) by adjusting the threshold definition at the top of the script.

Honestly, I (still) can't be bothered to figure out how GreasyFork works, so just copy-paste the contents of the YouTube-Replay-Count.txt file into a new Tampermonkey script if you want to use it.

## CHROME EXTENTION VERSION IS UNDER DEVELOPMENT (under this same repository)
