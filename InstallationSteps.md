# Installation Steps

- Install chruby ruby and xz (on MacOS)

      brew install chruby ruby-install xz


- Update to the ruby gem (if already installed)
       
      gem update --system

- Checkout dev/main branch of git repository using git commit / pull.

- Install Bundle and add webrick

      bundle install
      bundle add webrick

- For Incremental Serving of webpage
     
      bundle exec jekyll serve --incremental --port 4000

- [Optional] For installing Jekyll (remember using this step will mess up the existing code. DO NOT apply this)

      jekyll new --skip-bundle . --force

- Killing Opened Ports

      kill -9 $(lsof -ti:3000)