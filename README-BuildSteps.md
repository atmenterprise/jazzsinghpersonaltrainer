
brew install chruby ruby-install xz

gem update --system


jekyll new --skip-bundle . --force

bundle install
bundle add webrick

bundle exec jekyll serve
